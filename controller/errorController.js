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

  // console.log(errors);
  const message = `Invalid Field data : ${errors}`;
  const error = new AppError(message, 400);

  return error;
};

// JWT ERRORS
const handleJWTError = () => new AppError('Invalid Token', 401);
const handleJWTExpiredError = () =>
  new AppError('Token Expired, Please login again', 401);

const errDevMsg = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went worng',
      msg: err.message,
    });
  }
};

const errProdMsg = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'fail';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    errDevMsg(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);

    if (err.code === 11000) error = handleDuplicateValDB(error);

    if (err.name === 'ValidationError') error = handleValidationDB(error);

    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'tokenExpiredError') error = handleJWTExpiredError();
    errProdMsg(error, req, res);
  }
};
