const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Err Str : tour must have name'],
      unique: true,
      trim: true,
      maxLength: [40, 'The name must less then or equal to 40'],
      minLength: [10, 'The name must greater then or equal to 10'],
      // validate: [validator.isAlpha, 'Name must contain only character'],
    },
    slug: String,
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
      max: [5, 'The rating must be less then or equal to 5.0'],
      min: [1, 'The name must greater then or equal to 1.0'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulty should be easy, medium or difficult',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // This will not work with update
          return this.price > val;
        },
        message:
          'The Discount price ({VALUE}) must be less then the real price',
      },
    },
    imageCover: {
      type: String,
      required: [true, 'Err Str : tour must have image'],
    },
    images: [String],
    secretTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // this will not show to the client
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE : it will run before .save() or .create()methods
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', (doc, next) => {
//   // console.log(doc);
//   next();
// });

// Query MW
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.post(/^find/, (doc, next) => {
//   console.log(doc);
//   next();
// });

// AGGREGATION MW
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
