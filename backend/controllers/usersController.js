const mongoose = require('mongoose');
const User = require('../models/userModel');

// retrieve all users
const getUsers = async( req, res ) => {
    const users = await User.find({}).sort({});
    res.status(200).json(users);
};
// retrieve a single user
const getUser = async( req, res ) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
};
// add a single user
const addUser = async( req, res) => {
    const {first_name, middle_name, last_name, full_name, user_type, user_id, birthdate, username, password} = req.body;
    try {
        const user = await User.create({first_name, middle_name, last_name, full_name, user_type, user_id, birthdate, username, password});
        res.status(200).json(user);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};
// update an existing user
const updateUser = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'User does not exist.'});
    };
    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!user){
        return res.status(400).json({Error: 'User does not exist.'});
    };
    res.status(200).json(user);
};
// delete an existing author
const deleteUser = async(req, res)=>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'User does not exist.'});
    };
    const user = await User.findOneAndDelete({_id: id});
    if(!user){
        return res.status(400).json({Error: 'User does not exist.'});
    };
    res.status(200).json(user);
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
}
