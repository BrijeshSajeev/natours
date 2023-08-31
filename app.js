// Express
const express = require('express');

const routeUser = require('./routes/userRoutes');
const routeTour = require('./routes/tourRoutes');

const app = express();
////////////////////
// Middleware
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('Hello from the middleware👋');
  next();
});
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
app.use('/api/v1/users', routeUser);
app.use('/api/v1/tours', routeTour);

// Middle ware for worng Urls
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can't access this ${req.originalUrl}`,
  });
});
module.exports = app;
/////////////////////////////////
