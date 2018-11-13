'use strict';

const Book = require('../../models/book');

/**
 * GET /book route to retrieve all the books
 */

function getBooks(req, res) {
    // Query the DB and if no errors, send all the books
    let query = Book.find({});
    query.exec((err, books) => {
        if (err) res.send(err);
        //If no errors, send them back to the clients
        res.json(books);
    });
}

/**
 * POST /book to save a new book
 */

function postBook(req, res) {
    // Create a new book
    const newBook = new Book(req.body);
    // Save it into the DB
    newBook.save((err, book) => {
        if (err) {
            res.send(err);
        } else {
            // If no erros, send it back to the clients
            res.send({
                message: 'Book successfully added!',
                book,
            });
        }
    });
}

/**
 * GET /book/:id route to retrieve a book given its id.
 */
function getBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (book) {
            return res.send(book);
        } else {
            return res.status(404).send({
                message: 'Book not found!',
                id: req.params.id,
            });
        }
    });
}

/**
 * DELETE /book/:id to delete a book given its id.
 */
function deleteBook(req, res) {
    Book.remove(
        {
            _id: req.params.id,
        },
        (err, result) => {
            if (err) {
                return res.status(400).send(err);
            }
            if (result.result.n === 0) {
                return res.status(404).send({
                    message: 'Book not found!',
                    id: req.params.id,
                });
            } else {
                return res.json({
                    message: 'Book successfully deleted!',
                    result,
                });
            }
        }
    );
}

/**
 * PUT /book/:id to update a book given its id
 */

function updateBook(req, res) {
    Book.findById(
        {
            _id: req.params.id,
        },
        (err, book) => {
            if (err) {
                return res.status(400).send(err);
            }
            if (!book) {
                return res.status(404).send({
                    message: 'Book not found!',
                    id: req.params.id,
                });
            } else {
                Object.assign(book, req.body).save((err, book) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.json({
                        message: 'Book updated!',
                        book,
                    });
                });
            }
        }
    );
}

// Export all the functions

module.exports = {
    getBooks,
    postBook,
    getBook,
    deleteBook,
    updateBook,
};
