const Stripe = require('stripe');

const factory = require('./handlerFactory');

const Tour = require('../model/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const stripe = Stripe(
  'sk_test_51NuECTSEwqRC9OPWk0FY7hmZhR9HosYssTCyGSlplZ9WBuNNwoYG9EGmeCt4o4Q3Yk4JUdpl4QvTcUpIaMtjhKdt00Sd3PF41s',
);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('Invalid tour!', 404));
  }
  const price = tour.price * 100;

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: 'INR',
          product_data: {
            name: `${tour.name} Tour`,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
            description: tour.summary,
          },
          unit_amount: price * 87,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
