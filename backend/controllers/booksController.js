const mongoose = require('mongoose');
const Book = require('../models/bookModel');

// retrieve all books
const getBooks = async( req, res ) => {
    const books = await Book.find({}).sort({});
    res.status(200).json(books);
};

// retrieve a single book
const getBook = async( req, res ) => {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
};

// add a single book
const addBook = async( req, res) => {
    const {title, image, isbn, author, pages, binding, checkedOut, holds, type} = req.body;
    try {
        const book = await Book.create({title, image, isbn, author, pages, binding, checkedOut, holds, type});
        res.status(200).json(book);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};

// update an existing book
const updateBook = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Book does not exist.'});
    };
    const book = await Book.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!book){
        return res.status(400).json({Error: 'Book does not exist.'});
    };
    res.status(200).json(book);
};

// delete an existing book
const deleteBook = async(req, res)=>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Book does not exist.'});
    };
    const book = await Book.findOneAndDelete({_id: id});
    if(!book){
        return res.status(400).json({Error: 'Book does not exist.'});
    };
    res.status(200).json(book);
}

module.exports = {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook
}