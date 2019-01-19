const mongoose = require('mongoose');
const validator = require('validator');
const mongoDBErrorHandler = require('mongoose-mongodb-errors');

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      validator: [validator.isMongoId, 'it must be a mongodb ID'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.plugin(mongoDBErrorHandler);

module.exports = model('Booking', bookingSchema);
