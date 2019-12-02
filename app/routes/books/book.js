'use strict';

const Book = require('../../models/book');

/**
 * GET /book route to retrieve all the books
 */

async function getBooks(req, res) {
  // Query the DB and if no errors, send all the books
  let books = await Book.find({})
    .exec()
    .catch(res.send);

  res.json(books);
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
        book
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
        id: req.params.id
      });
    }
  });
}

/**
 * DELETE /book/:id to delete a book given its id.
 */
async function deleteBook(req, res) {
  try {
    const result = await Book.deleteOne({
      _id: req.params.id
    });
    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: 'Book not found!',
        id: req.params.id
      });
    } else {
      return res.json({
        message: 'Book successfully deleted!',
        result
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}

/**
 * PUT /book/:id to update a book given its id
 */

async function updateBook(req, res) {
  try {
    let book = await Book.findById({
      _id: req.params.id
    });
    if (!book) {
      return res.status(404).send({
        message: 'Book not found!',
        id: req.params.id
      });
    } else {
      book = await Object.assign(book, req.body).save();
      return res.json({
        message: 'Book updated!',
        book
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}

// Export all the functions

module.exports = {
  getBooks,
  postBook,
  getBook,
  deleteBook,
  updateBook
};
