const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: String,
    ref: 'Tour',
    required: [true, 'Booking must have a tour name!']
  },
  user: {
    type: String,
    ref: 'User',
    required: [true, 'Booking must have a user!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  paid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });

  next();
});

const Booking = new mongoose.model('Booking', bookingSchema);

module.exports = Booking;
