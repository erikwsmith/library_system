const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {type: Number, required: true, unique: true, trim: true},
    first_name: {type: String, required: true, unique: false, trim: true, minlength: 1},
    middle_name: {type: String, required: false, unique: false, trim: true},
    last_name: {type: String, required: true, unique: false},
    full_name: {type: String, unique: false},
    birthdate: {type: Date, required: true},
    user_type: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true}
}, {
    timestamps: true
}, {
    collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;