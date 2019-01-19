const mongoose = require('mongoose');
const validator = require('validator');
const mongoDBErrorHandler = require('mongoose-mongodb-errors');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: 'please supply an email address',
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
});

userSchema.plugin(mongoDBErrorHandler);

module.exports = model('User', userSchema);
