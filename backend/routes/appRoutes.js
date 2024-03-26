const express = require('express');
const router = express.Router();

const { getBooks, getBook, addBook, updateBook, deleteBook } = require('../controllers/booksController');
const { getAuthors, getAuthor, addAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorsController');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../controllers/usersController');

// BOOKS
router.get('/books', getBooks); // READ all books
router.get('/books/:id', getBook);//READ a book
router.post('/books/add', addBook); // CREATE a book
router.patch('/books/:id', updateBook); // UPDATE a book)
router.delete('/books/:id', deleteBook); // DELETE a book

// AUTHORS
router.get('/authors', getAuthors); // READ all authors
router.get('/authors/:id', getAuthor); // READ an author
router.post('/authors/add', addAuthor); // CREATE an author
router.patch('/authors/:id', updateAuthor); // UPDATE an author
router.delete('/authors/:id', deleteAuthor); // DELETE an author

// USERS
router.get('/users', getUsers); // READ all users
router.get('/users/:id', getUser); // READ a user
router.post('/users/add', addUser); // CREATE a user
router.patch('/users/:id', updateUser); // UPDATE a user
router.delete('/users/:id', deleteUser); // DELETE a user

module.exports = router;