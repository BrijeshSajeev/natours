const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

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

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
