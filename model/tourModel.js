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
      // required: [true, 'Err Str : tour must have image'],
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
    guides: [
      {
        type: mongoose.Schema.ObjectId, // which means we expect a type of each of the elements to be a MongoDB ID
        ref: 'User', // referencing
      },
    ],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  // To connect we have to specifiy the field name which is referenced in the Review model
  foreignField: 'tour',
  // To connect we have to specifiy the field name which is in the current model (_id)
  localField: '_id',
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
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeTime',
  });
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
