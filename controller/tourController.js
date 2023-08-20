const Tour = require('../model/tourModel');

exports.createTour = async (req, res) => {
  // const tour = new Tour({});
  // tour.save();

  try {
    const newTour = await Tour.create(req.body);
    // console.log(newTour);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // console.log('Error 🔥', err);
    return res.status(400).json({
      status: 'fail',
      message: 'error',
    });
  }
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.find((ele) => ele.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      // tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};

exports.deleteTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'not yet completed',
  });
};

//////////////////////////////////////////
/*
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
//   // fs.readFileSync('./../dev-data/data/tours-simple.json')
// );

exports.checkId = (req, res, next, val) => {
  // if (val > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid Id',
  //   });
  // }
  // next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
};

*/
