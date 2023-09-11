const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate('author').populate('tour');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // 1 Getting token and check it
  //   let token;

  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith('Bearer')
  //   ) {
  //     token = req.headers.authorization.split(' ')[1];
  //   }
  //   if (!token) {
  //     return next(new AppError('you are not logged in!, Please Login'));
  //   }
  //   // 2 verification token
  //   const verification = promisify(jwt.verify);
  //   const decoded = await verification(token, process.env.JWT_SECRET);
  const reviewObj = {
    review: req.body.review,
    tour: req.body.tour,
    rating: req.body.rating,
    author: req.body.author,
  };

  const review = await Review.create(reviewObj);

  if (!review) {
    return next(new AppError('Something went worng!', 500));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
