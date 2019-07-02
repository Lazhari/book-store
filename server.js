const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./app/routes');
const config = require('config');

const port = process.env.PORT || config.PORT || 3000;

const options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 3000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 3000
    }
  }
};

// DB connection
const mongoURI = process.env.DBHost || config.DBHost;
mongoose.connect(mongoURI, options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

if (config.util.getEnv('NODE_ENV') !== 'test') {
  // use morgan to log at command line
  app.use(morgan('combined'));
}

// Parse application/json and look for raw text
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.text());
app.use(
  bodyParser.json({
    type: 'application/json'
  })
);

routes(app);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;
