const mongoose = require('mongoose');
const slugify = require('slugify');
// const User  = require("./userModel");
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Missing a tour name!'],
      unique: true,
      minlength: [10, 'A name must have minimum of 10 characters!'],
      maxlength: [40, 'A name must have maximum of 40 characters!']
      // validate: [validator.isAlpha, "A tour name can only contain letters!"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration!']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size!']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty!'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A difficulty must be either: easy, medium or difficult!'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A rating can't be lower than 1.0"],
      max: [5, "A rating can't be higher than 5.0"],
      set: value => Math.round(value * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      defaul: 0
    },
    price: {
      type: Number,
      required: [true, 'Missing a tour price!']
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only points to the current document on NEW document creation (not update)
        validator: function(val) {
          return val < this.price;
        },
        message: 'A discount price ({VALUE}) must be less than a regular price!'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary!']
    },
    description: {
      type: String,
      trim: true
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      description: String,
      address: String
    },
    locations: [
      {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", async function(next) {
//   const guidesPromises = this.guides.map(async el => await User.findById(el));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// })

// tourSchema.pre('save', function(next) {
//   console.log('Will save a document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -changedPasswordAt'
  });

  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
