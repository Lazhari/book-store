'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Author Schema definition

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    birth_year: {
        type: String,
        required: true,
    },
    bio: {
        type: String
    },
    country: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

// Set the createdAt parameter equal to the current time
AuthorSchema.pre('save', next => {
    const now = new Date();
    if(!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

// Exports the AuthorSchema for use elsewhere
module.exports = mongoose.model('author', AuthorSchema);