'use strict';
/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 8000;
const book = require('./app/routes/book');
const config = require('config');

// DB options
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
mongoose.connect(config.DBHost, options);

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error: '));

if (config.util.getEnv('NODE_ENV') !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));
}

// Parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/json'
}));

app.get('/', (req, res) => res.json({
    message: 'Welcome to our Bookstore!'
}));

app.route('/book')
    .get(book.getBooks)
    .post(book.postBook);
app.route('/book/:id')
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;