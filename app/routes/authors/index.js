'use strict';

const router = require('express').Router();
const author = require('./author');

router.route('/')
    .get(author.getAuthors)
    .post(author.postAuthor);

router.route('/:id')
    .get(author.getAuthor)
    .delete(author.deleteAuthor)
    .put(author.updateAuthor);


module.exports = router;