import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

import Navbar from './components/navbar.component';
import Home from './components/home.component';
import BooksList from './components/books-list.component';
import EditBook from './components/edit-book.component';
import AddBook from './components/add-book.component';
import AuthorsList from './components/authors-list.component';
import AddAuthor from './components/add-author.component';
import EditAuthor from './components/edit-author.component';
import UsersList from './components/users-list.component';
import AddUser from './components/add-user.component';
import EditUser from './components/edit-user.component';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/books' exact element={<BooksList/>} />
        <Route path='/books/:id' element={<EditBook/>} />
        <Route path='/books/add' element={<AddBook/>} />
        <Route path='/authors' element={<AuthorsList/>} />
        <Route path='/authors/add' element={<AddAuthor/>} />
        <Route path='/authors/:id' element={<EditAuthor/>} />
        <Route path='/users' element={<UsersList/>} />
        <Route path='/users/add' element={<AddUser/>} />
        <Route path='/users/:id' element={<EditUser/>} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
