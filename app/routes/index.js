'use strict';

const book = require('./book');

module.exports = function (app) {
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
};