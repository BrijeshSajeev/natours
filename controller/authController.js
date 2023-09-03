const User = require('../model/userModel');

exports.signUp = async (req, res, next) => {
  const user = User.create(req.body);

  res.status(200).json({
    status: 'Sucess',
    data: {
      user,
    },
  });
};
