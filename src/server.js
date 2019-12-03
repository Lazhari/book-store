const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('config');
const http = require('http');
const { createTerminus } = require('@godaddy/terminus');

const port = process.env.PORT || config.PORT || 3000;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 0,
  keepAlive: true
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

const server = http.createServer(app);

function onSignal() {
  console.log('server is starting cleanup');
  // start cleanup of resource, like databases or file descriptors
}

async function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
}

createTerminus(server, {
  signal: 'SIGINT',
  healthChecks: { '/healthcheck': onHealthCheck },
  onSignal
});

server.listen(port, err => {
  if (err) {
    console.error('Something went wrong', err);
  }
  console.log(`The magic happen on http://localohst:${port}`);
});

module.exports = app;
