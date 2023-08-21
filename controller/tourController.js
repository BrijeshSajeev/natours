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
    // BUILD THE QUERY
    // Filtering
    const queryObj = { ...req.query };
    const excludeEle = ['page', 'sort', 'fields', 'limit'];
    // console.log(req.query);
    excludeEle.forEach((el) => delete queryObj[el]);
    // Advance Filtering
    // { duration: { gte: '5' }, difficulty: 'easy' }
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    let query = Tour.find(JSON.parse(queryString));

    // SORTING
    if (req.query.sort) {
      const sortStr = req.query.sort.split(',').join(' ');
      query = query.sort(sortStr);
      // sort('price ratingAverage')
    } else {
      // Default
      query = query.sort('createdAt');
    }

    // FIELD LIMITING
    if (req.query.fields) {
      const fieldStr = req.query.fields.split(',').join(' ');
      query = query.select(fieldStr);
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const noOfTours = await Tour.countDocuments();
      if (skip >= noOfTours) throw new Error("This page doesn't exists");
    }
    // EXECUTE THE QUERY

    const tours = await query;

    // USING MONGOOSE
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SENDING RESPONSE
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
      message: err,
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
    res.status(204).json({
      // status: 'sucess',
    });
  } catch (err) {
    res.status(404).json({
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
