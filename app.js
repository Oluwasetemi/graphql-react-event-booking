const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/events');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

// eslint-disable-next-line prettier/prettier
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
      user: [User!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema{
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return { ...event._doc, _id: event.id };
            });
          }).catch(err => {
            throw err;
          })
      },
      createEvent: args => {
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
          title,
          description,
          price: +price,
          date: new Date(date),
          creator: '5c37ddf3fc64431518dbcc22',
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = {
              ...result._doc,
              _id: result._doc._id.toString(),
            };
            return User.findById('5c37ddf3fc64431518dbcc22')

          })
          .then(user => {
            if (!user) {
              throw new Error('User cannot be found.');
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            throw err;
          });
      },
      createUser: args => {
        const { email, password } = args.userInput;
        return User.findOne({ email })
          .then(user => {
            if (user) {
              throw new Error('User exists already.');
            }
            return bcrypt.hash(password, 12);
          })
          .then(hashedPassword => {
            const user = new User({
              email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then(result => {
            return {
              ...result._doc,
              password: null,
              _id: result.id,
            }
          })
          .catch(err => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

const dbUrl =
  `mongodb://localhost:27017/eventbooking_db` ||
  `mongodb://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@ds155833.mlab.com:55833/eventdb`;

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useCreateIndex: true }
);

mongoose.Promise = global.Promise;

mongoose.connection.once('open', () => {
  console.log('connected to the database ✔✔✔');
});

mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
