const crypto = require('crypto');
const { promisify } = require('util');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const Emial = require('../utils/email');
const Email = require('../utils/email');

// const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expires: new Date( // this will delete the cookie after the expiration date
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100,
    ),
    // secure: true, // the cookie can only be sent on an encrypted connection (https)
    httpOnly: true, // it will make the cookie can't to accessed or modified in any way by the browser
  };

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;

  res.cookie('jwt', token, cookieOption);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // This is will create a security issue that everyone can login as admin
  // const user = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 check for email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2 Check wheather the email and password is exists in db
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3 if every thing is ok then send the token
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1 Getting token and check it
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('you are not logged in!, Please Login'));
  }
  // 2 verification token
  const verification = promisify(jwt.verify);
  const decoded = await verification(token, process.env.JWT_SECRET);

  // 3 Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User Not found'), 401);
  }

  // 4 check if user changed the password after the token is issued

  if (currentUser.changePasswordTime(decoded.iat)) {
    return next(
      new AppError('user recently changed password, Please login again!', 401),
    );
  }
  // Grant Access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 2 verification token
      const verification = promisify(jwt.verify);
      const decoded = await verification(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 3 Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4 check if user changed the password after the token is issued

      if (currentUser.changePasswordTime(decoded.iat)) {
        return next();
      }
      // There is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'Loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied!', 403));
    }
    next();
  };

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1 find the user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found', 401));
  }
  // generate the random reset password token
  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it through email

  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/resetpassword/${token}`;

    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);
    return next(
      new AppError('There was error sending an email!,Try again!', 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get the user based on the token

  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 If the token is not expired and the user is present, Set new password
  if (!user) {
    return next(new AppError('Invalid token or has expired', 400));
  }

  // 3 Update Change password at property
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4 Login the user
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 Check the user
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('user not found', 401));
  }
  // 2 check the current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('incorrect password', 400));
  }
  // 3 if so update the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 3 if every thing is ok then send the token
  createSendToken(user, 200, res);
});
