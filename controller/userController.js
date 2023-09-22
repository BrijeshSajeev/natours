const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
//  multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb - call back function with (err,path)
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const extention = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extention}`);
//   },
// });

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only images.', 400), false);
  }
};

const update = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uplodePhoto = update.single('photo');

const filterObj = (obj, ...props) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (props.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 Check if the password is modified
  // console.log(req.file);
  // console.log(req.body);

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
  if (req.file) filterData.photo = req.file.filename;
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
