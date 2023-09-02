const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
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

    errProdMsg(error, res);
  }
};
