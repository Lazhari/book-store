'use strict';

const Author = require('../../models/author');

/**
 * GET /api/authors route to retreive all authors
 */

function getAuthors(req, res) {
    // Query the DB and if no errors, send all authors
    let query = Author.find({});
    query.exec((err, authors) => {
        if (err) res.send(err);
        //If no errors, send them back to the clients
        res.json(authors);
    });
}

/**
 * POST /api/authors to save a new Author
 */

function postAuthor(req, res) {
    // Create a new Author
    const newAuthor = new Author(req.body);
    //Save it into the DB
    newAuthor.save()
        .then((author) => {
            return res.status(201).send({
                message: 'Author successfully added!',
                author
            });
        })
        .catch((err) => {
            return res.status(400).send(err);
        });
}

/**
 * GET /api/authors/:id to retrieve an author given its ID
 */

function getAuthor(req, res) {
    Author.findById(req.params.id)
        .then((author) => {
            if (author) {
                return res.json(author);
            } else {
                res.status(404).send({
                    message: 'Author not found!',
                    id: req.params.id
                });
            }
        })
        .catch((err) => {
            return res.status(400).send(err);
        });
}

/**
 * Delete /api/authors/:id to delete an author given its ID
 */
function deleteAuthor(req, res) {
    const query = {
        _id: req.params.id
    };
    Author.remove(query)
        .then((result) => {
            if (result.result.n === 0) {
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
        })
        .catch((err) => {
            return res.status(400).send(err);
        });
}

/**
 * PUT /api/authors/:id to update an author given its ID
 */

function updateAuthor(req, res) {
    Author.findById(req.params.id)
        .then((author) => {
            if (!author) {
                return res.status(404).send({
                    message: 'Author not found!',
                    id: req.params.id
                });
            } else {
                Object.assign(author, req.body)
                    .save()
                    .then((author) => {
                        return res.json({
                            message: 'Author updated!',
                            author
                        });
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
        })
        .catch((err) => {
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