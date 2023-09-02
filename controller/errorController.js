const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  const error = new AppError(message, 400);

  return error;
};

const handleDuplicateValDB = (err) => {
  const value = err.keyValue.name;

  const message = `Duplicate fieldValue : ${value}. Please use another value`;
  const error = new AppError(message, 400);

  return error;
};

const handleValidationDB = (err) => {
  const errors = Object.values(err.errors)
    .map((ele) => ele.message)
    .join('. ');

  console.log(errors);
  const message = `Invalid Field data : ${errors}`;
  const error = new AppError(message, 400);

  return error;
};

const errDevMsg = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errProdMsg = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('🔥 ', err);
    res.status(500).json({
      status: 'error',
      error: err,
      message: 'Something went worng!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'fail';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    errDevMsg(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);

    if (err.code === 11000) error = handleDuplicateValDB(error);

    if (err.name === 'ValidationError') error = handleValidationDB(error);
    errProdMsg(error, res);
  }
};
