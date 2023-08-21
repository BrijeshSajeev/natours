const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Err Str : tour must have name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Err Str : tour must have description'],
  },

  price: {
    type: Number,
    required: [true, 'Err Str : tour must have price'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'tour required duration'],
  },
  maxGroupSize: Number,
  difficulty: {
    type: String,
    required: [true, 'tour required defficulty'],
  },
  summary: {
    type: String,
    trim: true,
  },
  priceDiscount: Number,
  imageCover: {
    type: String,
    required: [true, 'Err Str : tour must have image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // this will not show to the client
  },
  startDate: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
