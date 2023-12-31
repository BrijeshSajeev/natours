const crypto = require('crypto');
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
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minlength: 8,
    select: false,
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
  passwordChangeTime: {
    type: Date,
    // select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeTime = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  // only run when the password is modified or saved or created
  if (!this.isModified('password')) return next();

  // this encypt the the exist pass and return it
  this.password = await bcrypt.hash(this.password, 12);

  // After the validation was successfull we no longer need this
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordTime = function (JWTTimeStamp) {
  if (this.passwordChangeTime) {
    const changeTimeStamp = parseInt(
      this.passwordChangeTime.getTime() / 1000,
      10,
    );
    return changeTimeStamp > JWTTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
