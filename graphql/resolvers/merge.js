const User = require('../../models/user');
const Event = require('../../models/events');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    // eslint-disable-next-line no-shadow
    const events = await Event.find({ _id: { $in: eventIds } });
    // eslint-disable-next-line no-use-before-define
    return events.map(event => transformedEvent(event));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventID => {
  try {
    const event = await Event.findById(eventID);
    // eslint-disable-next-line no-use-before-define
    return transformedEvent(event);
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

const transformBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

const transformedEvent = event => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  creator: user.bind(this, event.creator),
});
// exports.events = events;
// exports.singleEvent = singleEvent;
// exports.user = user;

exports.transformBooking = transformBooking;
exports.transformedEvent = transformedEvent;
