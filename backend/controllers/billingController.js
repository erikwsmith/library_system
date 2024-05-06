const mongoose = require('mongoose');
const Billing = require('../models/billingModel');

// retrieve all billing records
const getBillings = async( req, res ) => {
    const records = await Billing.find({}).sort({updatedAt: -1});
    res.status(200).json(records);
};
// retrieve a single record
const getBilling = async( req, res ) => {
    const record = await Billing.findById(req.params.id);
    res.status(200).json(record);
};
// add a single record
const addBilling = async( req, res) => {
    const {userAccount, circRecords, balance} = req.body;
    try {        
        const record = await Billing.create({userAccount, circRecords, balance});
        res.status(200).json(record);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};
// update an existing record
const updateBilling = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Record does not exist.'});
    };
    const record = await Billing.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!record){
        return res.status(400).json({Error: 'Record does not exist.'});
    };
    res.status(200).json(record);
};

module.exports = {
    getBillings,
    getBilling,
    addBilling,
    updateBilling
}
