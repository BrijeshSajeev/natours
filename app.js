// Express
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorController = require('./controller/errorController');
const routeUser = require('./routes/userRoutes');
const routeTour = require('./routes/tourRoutes');
const routeReview = require('./routes/reviewRoutes');
const routeView = require('./routes/viewRoutes');

const app = express();

////////////////////

//GLOBAL Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/',
  'https://*.stripe.com/',
  'https://js.stripe.com/',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://bundle.js:*',
  'ws://127.0.0.1:*/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  }),
);

//Rate Limiting from same IP
const limitRate = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests!, try again in a hour',
});

app.use('/api', limitRate);

// Body Parser, reading data from the body to the req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against sql-query-injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// Routes

app.use('/', routeView);
app.use('/api/v1/reviews', routeReview);
app.use('/api/v1/users', routeUser);
app.use('/api/v1/tours', routeTour);

// Middle ware for worng Urls
app.all('*', (req, res, next) => {
  next(new AppError(`can't access this ${req.originalUrl}`, 404));
});

app.use(globalErrorController);

module.exports = app;
/////////////////////////////////
// // Get request
// app.get('/api/v1/tours', getAllTours);
// Post request
// app.post('/api/v1/tours', createTour);
// Get element by Id
// app.get('/api/v1/tours/:id', getTour);

/////////////////////////////////
// ?MOUNTING
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .delete(deleteTour)
//   .patch(updateTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
