const express = require('express');
const router = express.Router();

const { getBooks, getBook, addBook, updateBook, deleteBook } = require('../controllers/booksController');
const { getAuthors, addAuthor, deleteAuthor } = require('../controllers/authorsController');

// BOOKS
router.get('/books', getBooks); // READ all books
router.get('/books/:id', getBook);//READ a book
router.post('/books/add', addBook); // CREATE a book
router.patch('/books/:id', updateBook); // UPDATE book)
router.delete('/books/:id', deleteBook); // DELETE book

// AUTHORS
router.get('/authors', getAuthors); // GET all authors
router.post('/authors/add', addAuthor); // ADD an author
router.delete('/authors/:id', deleteAuthor); // DELETE book


module.exports = router;