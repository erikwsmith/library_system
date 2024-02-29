const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    first_name: {type: String, required: true, unique: false, trim: true, minlength: 1},
    middle_name: {type: String, required: false, unique: false, trim: true},
    last_name: {type: String, required: true, unique: false},
    full_name: {type: String, unique: false},
    biography: {type: String, required: false, unique: false, trim: true}
}, {
    timestamps: true
}, {
    collection: 'authors'
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;