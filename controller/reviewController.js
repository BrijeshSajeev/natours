const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const reviewObj = {
    review: req.body.review,
    tour: req.body.tour,
    rating: req.body.rating,
    author: req.user.id,
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
