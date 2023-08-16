// File system
const fs = require('fs');
// Express
const express = require('express');
const exp = require('constants');

const app = express();
////////////////////
// Middleware
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Hello from the middleware👋');
  next();
});

// /////////////////
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((ele) => ele.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};

const deleteTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};
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

const routeTour = express.Router();
const routeUser = express.Router();

routeTour.route('/').get(getAllTours).post(createTour);
routeTour.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

routeUser.route('/').get(getAllUsers).post(createUser);
routeTour.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

app.use('/api/v1/users', routeUser);
app.use('/api/v1/tours', routeTour);

/////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log('System is running');
});
