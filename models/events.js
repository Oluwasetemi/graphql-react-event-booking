const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
});

module.exports = model('Event', eventSchema);
