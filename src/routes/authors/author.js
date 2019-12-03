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
  try {
    const author = await newAuthor.save();
    return res.status(201).send({
      message: 'Author successfully added!',
      author
    });
  } catch (err) {
    return res.status(400).send(err);
  }
}

/**
 * GET /api/authors/:id to retrieve an author given its ID
 */
async function getAuthor(req, res) {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      return res.json(author);
    }
    return res.status(404).send({
      message: 'Author not found!',
      id: req.params.id
    });
  } catch (err) {
    return res.status(400).send(err);
  }
}

/**
 * Delete /api/authors/:id to delete an author given its ID
 */
async function deleteAuthor(req, res) {
  const query = {
    _id: req.params.id
  };
  try {
    const result = await Author.deleteOne(query);
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
  } catch (err) {
    return res.status(400).send(err);
  }
}

/**
 * PUT /api/authors/:id to update an author given its ID
 */
async function updateAuthor(req, res) {
  try {
    let author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).send({
        message: 'Author not found!',
        id: req.params.id
      });
    }
    author = await Object.assign(author, req.body).save();
    return res.json({
      message: 'Author updated!',
      author
    });
  } catch (err) {
    return res.status(400).send(err);
  }
}
// Export all the functions
module.exports = {
  getAuthors,
  postAuthor,
  getAuthor,
  deleteAuthor,
  updateAuthor
};
