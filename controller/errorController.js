const errDevMsg = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errProdMss = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
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
    errProdMss(err, res);
  }
};
