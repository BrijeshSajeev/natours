const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    required: [true, 'please confirm your password'],
    // we pass a simple callback func that will be called when new doc is created el is the current element and this will only work in 'save and create'
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords are not the same',
    },
  },
});
const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  // After the validation was successfull we no longer need this
  this.passwordConfirm = undefined;
  next();
});

module.exports = User;
