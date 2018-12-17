const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/events');

const app = express();
const events = [];

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
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
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return {
              ...result._doc,
              _id: result._doc._id.toString(),
            };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose.connect(
  `mongodb://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@ds155833.mlab.com:55833/eventdb`,
  {
    useNewUrlParser: true,
  }
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
