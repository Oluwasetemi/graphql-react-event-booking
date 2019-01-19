const mongoose = require('mongoose');
const mongoDBErrorHandler = require('mongoose-mongodb-errors');

const { Schema, model } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: 'Event must have a name',
    trim: true,
  },
  description: {
    type: String,
    required: 'A description is required.',
    trim: true,
  },
  price: {
    type: Number,
    required: 'Enter a price for the event',
  },
  date: {
    type: Date,
    default: new Date().toISOString(),
    required: 'Must be a date',
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

eventSchema.plugin(mongoDBErrorHandler);

module.exports = model('Event', eventSchema);
