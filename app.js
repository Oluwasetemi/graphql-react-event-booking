// import all the Database Model
require('./models/events');
require('./models/user');
require('./models/booking');

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const isAuth = require('./middleware/is-auth');
const graphQlResolvers = require('./graphql/resolvers');


const app = express();

app.use(bodyParser.json());

app.use(isAuth);

// eslint-disable-next-line prettier/prettier
app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express App Running at http://localhost:${server.address().port}!`);
});
