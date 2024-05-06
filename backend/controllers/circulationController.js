const mongoose = require('mongoose');
const Circulation = require('../models/circulationModel');

// retrieve all circulation records
const getRecords = async( req, res ) => {
    const records = await Circulation.find({}).sort({updatedAt: -1});
    res.status(200).json(records);
};
// retrieve a single record
const getRecord = async( req, res ) => {
    const record = await Circulation.findById(req.params.id);
    res.status(200).json(record);
};
// add a single record
const addRecord = async( req, res) => {
    const {userAccount, checkoutDate, dueDate, returnDate, itemID, itemTitle, itemType, daysOverdue, daysInUse, 
        dailyFee, totalFees} = req.body;
    try {        
        const record = await Circulation.create({userAccount, checkoutDate, dueDate, returnDate, itemID, itemTitle, 
            itemType, daysOverdue, daysInUse, dailyFee, totalFees});
        res.status(200).json(record);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};
// update an existing record
const updateRecord = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Record does not exist.'});
    };
    const record = await Circulation.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!record){
        return res.status(400).json({Error: 'Record does not exist.'});
    };
    res.status(200).json(record);
};

module.exports = {
    getRecords,
    getRecord,
    addRecord,
    updateRecord
}
