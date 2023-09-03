const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have name'],
  },
  email: {
    type: String,
    required: [true, 'user must have name'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'provide valid email'],
  },
  role: {
    type: String,
  },
  active: Boolean,
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'please confirm your password'],
  },
});
const User = mongoose.model('User', userSchema);

module.exports = User;
