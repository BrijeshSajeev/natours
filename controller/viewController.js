const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //   1 get all tours
  const tours = await Tour.find();
  // build the template

  // send the data to the template form 1

  res.status(200).render('overview', {
    title: ' hello world',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: ' The Forest Hiker',
  });
};
