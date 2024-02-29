const mongoose = require('mongoose');
const Author = require('../models/authorModel');

// retrieve all authors
const getAuthors = async( req, res ) => {
    const authors = await Author.find({}).sort({});
    res.status(200).json(authors);
};

// add a single author
const addAuthor = async( req, res) => {
    const {first_name, middle_name, last_name, full_name, biography} = req.body;
    try {
        const author = await Author.create({first_name, middle_name, last_name, full_name, biography});
        res.status(200).json(author);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};
// delete an existing author
const deleteAuthor = async(req, res)=>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Author does not exist.'});
    };
    const author = await Author.findOneAndDelete({_id: id});
    if(!author){
        return res.status(400).json({Error: 'Author does not exist.'});
    };
    res.status(200).json(author);
}

module.exports = {
    getAuthors,
    addAuthor,
    deleteAuthor
}
