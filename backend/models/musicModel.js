const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const musicSchema = new Schema({
    image: {type: String},
    title: {type: String, required: true, trim: true, minlength: 1, unique: false},
    format: {type: String, required: true},
    artists: [String],
    genre: {type: String},
    tracks: [Object],
    runtime: {type: Number},
    releaseDate: {type: Number},
    checkedOut: {type: Boolean},
    type: {type: String},
    holds: [String],
    callNumber: {type: String}
}, {
    timestamps: true
}, {
    collection: 'musics'
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;