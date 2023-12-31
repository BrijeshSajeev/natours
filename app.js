// Express
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorController = require('./controller/errorController');
const routeUser = require('./routes/userRoutes');
const routeTour = require('./routes/tourRoutes');
const routeReview = require('./routes/reviewRoutes');
const routeBooking = require('./routes/bookingRoutes');
const routeView = require('./routes/viewRoutes');

const app = express();

////////////////////

//GLOBAL Middleware
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Set security HTTP headers
//app.use(helmet());
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/',
  'https://*.stripe.com/',
  'https://js.stripe.com/',

  'https://cdnjs.cloudflare.com',

  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
];
const styleSrcUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css',

  'https://api.mapbox.com/',
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://cdnjs.cloudflare.com',
];
const connectSrcUrls = [
  'ws://localhost:57138/',
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://bundle.js:*',

  'https://unpkg.com',
  'https://tile.openstreetmap.org',
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
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://cdnjs.cloudflare.com',
        'https://c.tile.openstreetmap.org',
        'https://a.tile.openstreetmap.org',
        'https://b.tile.openstreetmap.org',
      ],
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

// Middle ware to parse the data coming from a from(URL encoded)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization against sql-query-injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp());

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes

app.use('/', routeView);
app.use('/api/v1/reviews', routeReview);
app.use('/api/v1/users', routeUser);
app.use('/api/v1/tours', routeTour);
app.use('/api/v1/bookings', routeBooking);

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
