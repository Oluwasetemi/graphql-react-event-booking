const mongoose = require('mongoose');
const { dateToString } = require('../../helpers/date');
const { transformedEvent } = require('./merge');

const Event = mongoose.model('Event');
const User = mongoose.model('User');

module.exports = {
  events: async () => {
    try {
      // eslint-disable-next-line no-shadow
      const events = await Event.find();
      return events.map(event => transformedEvent(event));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated');
    }
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: +price,
      date: dateToString(date),
      creator: '5c39160f461f5e4e4ca921e8',
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformedEvent(result);
      // eslint-disable-next-line no-shadow
      const creator = await User.findById('5c39160f461f5e4e4ca921e8');

      if (!creator) {
        throw new Error('User cannot be found.');
      }

      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
};
