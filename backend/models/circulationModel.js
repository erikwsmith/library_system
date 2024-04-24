const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const circulationSchema = new Schema({    
    userAccount: {type: String, trim: true},    
    checkoutDate: {type: Date},
    dueDate: {type: Date},
    returnDate: {type: Date},
    itemTitle: {type: String},
    itemID: {type: String},
    itemType: {type: String}
}, {
    timestamps: true
}, {
    collection: 'circulations'
});

const Circulation = mongoose.model('Circulation', circulationSchema);

module.exports = Circulation;