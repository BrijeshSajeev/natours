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
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});

    res.status(200).json({
      status: 'success',
      time: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'bad Request',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'bad Request',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: 'bad request',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // const tour = await Tour.deleteOne({ _id: req.params.id });
    await Tour.findByIdAndDelete(req.params.id);
    res.status(500).json({
      status: 'sucess',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'bad Request',
    });
  }
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
