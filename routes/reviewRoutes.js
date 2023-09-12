const express = require('express');
const ReviewController = require('../controller/reviewController');
const AuthController = require('../controller/authController');

const router = express.Router({ mergeParams: true });
router.use(AuthController.protect);
router
  .route('/')
  .get(ReviewController.getAllReview)
  .post(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.setUserTourIds,
    ReviewController.createReview,
  );

router
  .route('/:id')
  .get(ReviewController.getReview)
  .delete(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.deleteReview,
  )
  .patch(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.updateReview,
  );

module.exports = router;
