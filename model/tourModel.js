const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Err Str : tour must have name'],
      unique: true,
      trim: true,
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
