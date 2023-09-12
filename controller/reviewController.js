const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  console.log('hello1');
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.author) {
    req.body.author = req.user.id;
  }
  console.log('hello2');

  const review = await Review.create(req.body);

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

exports.deleteReview = factory.deleteOne(Review);
