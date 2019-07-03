'use strict';

const Author = require('../../models/author');

/**
 * GET /api/authors route to retrieve all authors
 */

async function getAuthors(req, res) {
  // Query the DB and if no errors, send all authors
  const authors = await Author.find({})
    .exec()
    .catch(err => res.status(400).send({ message: err.message }));
  return res.send(authors);
}

/**
 * POST /api/authors to save a new Author
 */

async function postAuthor(req, res) {
  // Create a new Author
  const newAuthor = new Author(req.body);
  const author = await newAuthor.save().catch(err => res.status(400).send(err));

  return res.status(201).send({
    message: 'Author successfully added!',
    author
  });
}

/**
 * GET /api/authors/:id to retrieve an author given its ID
 */
function getAuthor(req, res) {
  Author.findById(req.params.id)
    .then(author => {
      if (author) {
        return res.json(author);
      } else {
        res.status(404).send({
          message: 'Author not found!',
          id: req.params.id
        });
      }
    })
    .catch(err => {
      return res.status(400).send(err);
    });
}

/**
 * Delete /api/authors/:id to delete an author given its ID
 */
async function deleteAuthor(req, res) {
  const query = {
    _id: req.params.id
  };
  const result = await Author.remove(query).catch(err => {
    return res.status(400).send(err);
  });
  if (result.deletedCount === 0) {
    return res.status(404).send({
      message: 'Author not found!',
      id: req.params.id
    });
  } else {
    return res.json({
      message: 'Author successfully deleted!',
      result
    });
  }
}

/**
 * PUT /api/authors/:id to update an author given its ID
 */
function updateAuthor(req, res) {
  Author.findById(req.params.id)
    .then(author => {
      if (!author) {
        return res.status(404).send({
          message: 'Author not found!',
          id: req.params.id
        });
      } else {
        Object.assign(author, req.body)
          .save()
          .then(author => {
            return res.json({
              message: 'Author updated!',
              author
            });
          })
          .catch(err => {
            return res.status(500).send(err);
          });
      }
    })
    .catch(err => {
      return res.status(400).send(err);
    });
}
// Export all the functions
module.exports = {
  getAuthors,
  postAuthor,
  getAuthor,
  deleteAuthor,
  updateAuthor
};
