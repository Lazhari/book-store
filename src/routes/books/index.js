'use strict';

const router = require('express').Router();

const book = require('./book');

router
  .route('/')
  .get(book.getBooks)
  .post(book.postBook);

router
  .route('/:id')
  .get(book.getBook)
  .delete(book.deleteBook)
  .put(book.updateBook);

module.exports = router;
