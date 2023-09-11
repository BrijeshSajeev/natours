const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review can't be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: [5, 'review should be less then or equal to 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to tour.'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
