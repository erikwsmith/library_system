const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    image: {type: String},
    title: {type: String, required: true, trim: true, minlength: 1, unique: false},
    format: {type: String, required: true},
    runtime: {type: Number},
    rating: {type: String},
    releaseDate: {type: Number},
    checkedOut: {type: Boolean},
    type: {type: String},
    callNumber: {type: String},
    summary: {type: String},
    holds: [String]
}, {
    timestamps: true
}, {
    collection: 'movies'
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;