const express = require('express');
const router = express.Router();

const { getBooks, getBook, addBook, updateBook, deleteBook } = require('../controllers/booksController');
const { getAuthors, getAuthor, addAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorsController');
const { getArtists, getArtist, addArtist, updateArtist, deleteArtist } = require('../controllers/artistsController');
const { getMovies, getMovie, addMovie, updateMovie, deleteMovie } = require('../controllers/moviesController');
const { getAllMusic, getMusic, addMusic, updateMusic, deleteMusic} = require('../controllers/musicController');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../controllers/usersController');
const { getRecords, getRecord, addRecord, updateRecord } = require('../controllers/circulationController');
const { getBillings, getBilling, addBilling, updateBilling } = require('../controllers/billingController');

// BOOKS
router.get('/books', getBooks); // READ all books
router.get('/books/:id', getBook);//READ a book
router.post('/books/add', addBook); // CREATE a book
router.patch('/books/:id', updateBook); // UPDATE a book
router.delete('/books/:id', deleteBook); // DELETE a book

// AUTHORS
router.get('/authors', getAuthors); // READ all authors
router.get('/authors/:id', getAuthor); // READ an author
router.post('/authors/add', addAuthor); // CREATE an author
router.patch('/authors/:id', updateAuthor); // UPDATE an author
router.delete('/authors/:id', deleteAuthor); // DELETE an author

// ARTISTS
router.get('/artists', getArtists); // READ all artists
router.get('/artists/:id', getArtist); // READ an artist
router.post('/artists/add', addArtist); // CREATE an artist
router.patch('/artists/:id', updateArtist); // UPDATE an artist
router.delete('/artists/:id', deleteArtist); // DELETE an artist

//MOVIES
router.get('/movies', getMovies); // READ all movies
router.get('/movies/:id', getMovie);//READ a movie
router.post('/movies/add', addMovie); // CREATE a movie
router.patch('/movies/:id', updateMovie); // UPDATE a movie
router.delete('/movies/:id', deleteMovie); // DELETE a movie

//MUSIC
router.get('/music', getAllMusic); // READ all music
router.get('/music/:id', getMusic);//READ a music record
router.post('/music/add', addMusic); // CREATE a music record
router.patch('/music/:id', updateMusic); // UPDATE a music record
router.delete('/music/:id', deleteMusic); // DELETE a music record

// USERS
router.get('/users', getUsers); // READ all users
router.get('/users/:id', getUser); // READ a user
router.post('/users/add', addUser); // CREATE a user
router.patch('/users/:id', updateUser); // UPDATE a user
router.delete('/users/:id', deleteUser); // DELETE a user

// CIRCULATION
router.get('/circulation', getRecords); // READ all records
router.get('/circulation/:id', getRecord); // READ a record
router.post('/circulation/add', addRecord); // CREATE a circulation record
router.patch('/circulation/:id', updateRecord); // UPDATE a circulation record

// BILLING
router.get('/billing', getBillings); // READ all records
router.get('/billing/:id', getBilling); // READ a record
router.post('/billing/add', addBilling); // CREATE a billing record
router.patch('/billing/:id', updateBilling); // UPDATE a billing record

module.exports = router;