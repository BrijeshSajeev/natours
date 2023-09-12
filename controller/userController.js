const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...props) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (props.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 Check if the password is modified
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `Can't modify password in this route. Try  /updateMyPassword`,
        400,
      ),
    );
  }
  // 2 filer out unwanted  elements in the body
  const filterData = filterObj(req.body, 'name', 'email');
  // 3 update the user Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'successfully deleted',
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
