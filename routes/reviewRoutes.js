const express = require('express');
const ReviewController = require('../controller/reviewController');
const AuthController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(AuthController.protect, ReviewController.getAllReview)
  .post(
    AuthController.protect,
    AuthController.restrictTo('user', 'admin'),
    ReviewController.createReview,
  );

router.route('/:id').delete(ReviewController.deleteReview);

module.exports = router;
