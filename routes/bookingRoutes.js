const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking)
  .get(bookingController.getBooking);

module.exports = router;
