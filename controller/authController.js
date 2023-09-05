const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // This is will create a security issue that everyone can login as admin
  // const user = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
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
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1 Getting token and check it
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
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
  next();
});

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
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/resetpassword/${token}`;
  const message = `Forget your Password? Sunbmit a patch request with your new password and confirmPassword to ${resetUrl}.\nIf you didn't forget your password please ignore this email `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (10 mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your mail',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTime = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was error sending an email!,Try again!', 500),
    );
  }
});

exports.resetPassword = (req, res, next) => {};
