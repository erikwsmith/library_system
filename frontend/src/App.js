import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

import Navbar from './components/navbar.component';
import Home from './components/home.component';
import BooksList from './components/books-list.component';
import EditBook from './components/edit-book.component';
import AddBook from './components/add-book.component';
import AuthorsList from './components/authors-list.component';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/books" exact element={<BooksList/>} />
        <Route path="/books/:id" element={<EditBook/>} />
        <Route path="/books/add" element={<AddBook/>} />
        <Route path="/authors" element={<AuthorsList/>} />
      </Routes>
    </BrowserRouter>

  );
};

export default App;
