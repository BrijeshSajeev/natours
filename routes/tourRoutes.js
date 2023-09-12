const express = require('express');

const tourController = require(`./../controller/tourController`);
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkId);

// router
//   .route('/:tourId/review')
//   .get(authController.protect, reviewController.getAllReview)
//   .post(
//     authController.protect,
//     authController.restrictTo('user', 'admin'),
//     reviewController.createReview,
//   );

router.use('/:tourId/review', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasToTour, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyplan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    // authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
