const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const billingSchema = new Schema({    
    userAccount: {type: String, trim: true},    
    circRecords: [Object],
    balance: {type: Number}    
}, {
    timestamps: true
}, {
    collection: 'billings'
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;