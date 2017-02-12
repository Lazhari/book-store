'use strict';

module.exports = function (app) {
    app.get('/', (req, res) => res.json({
        message: 'Welcome to our Bookstore!'
    }));

    app.use('/api/books', require('./books'));
    app.use('/api/authors', require('./authors'));
};