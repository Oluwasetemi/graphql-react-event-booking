/* eslint-disable no-use-before-define */
const bcrypt = require('bcryptjs');

const Event = require('../../models/events');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const events = async eventIds => {
  try {
    // eslint-disable-next-line no-shadow
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => ({
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      // eslint-disable-next-line no-use-before-define
      creator: user.bind(this, event.creator),
    }));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventID => {
  try {
    const event = await Event.findById(eventID);
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    // eslint-disable-next-line no-shadow
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => ({
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      }));
    } catch (err) {
      throw err;
    }
  },
  events: async () => {
    try {
      // eslint-disable-next-line no-shadow
      const events = await Event.find();
      return events.map(event => ({
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      }));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: '5c39160f461f5e4e4ca921e8',
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
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
  createUser: async args => {
    const { email, password } = args.userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      // eslint-disable-next-line no-shadow
      const user = new User({
        email,
        password: hashedPassword,
      });
      const result = await user.save();
      return {
        ...result._doc,
        password: 'null',
        _id: result.id,
      };
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: '5c37ddf3fc64431518dbcc22',
        event: fetchedEvent,
      });

      const result = await booking.save();

      return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      console.log(args);
      const booking = await Booking.findById(args.bookingId).populate('event');

      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user(this, booking.event._doc.creator),
      };

      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
