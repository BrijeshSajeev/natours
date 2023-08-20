const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Err Str : tour must have name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Err Str : tour must have price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
