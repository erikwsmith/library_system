import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

import Navbar from './components/navbar.component';
import Home from './components/home.component';
import BooksList from './components/books/books-list.component';
import EditBook from './components/books/edit-book.component';
import AddBook from './components/books/add-book.component';
import AuthorsList from './components/authors/authors-list.component';
import AddAuthor from './components/authors/add-author.component';
import EditAuthor from './components/authors/edit-author.component';
import UsersList from './components/users/users-list.component';
import AddUser from './components/users/add-user.component';
import EditUser from './components/users/edit-user.component';
import MoviesList from './components/movies/movies-list.component';
import EditMovie from './components/movies/edit-movie.component';
import AddMovie from './components/movies/add-movie.component';
import MusicList from './components/music/music-list.component';
import EditMusic from './components/music/edit-music.component';
import AddMusic from './components/music/add-music.component';
import ArtistsList from './components/artists/artists-list.component';
import EditArtist from './components/artists/edit-artist.component';
import AddArtist from './components/artists/add-artist.component';
import Checkout from './components/checkout';
import Return from './components/return';
import CirculationList from './components/circulation/circulation-list.component';
import BillingList from './components/billing/billing-list_component';
import Login from './components/login';

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
        <Route path='/movies' element={<MoviesList/>} />
        <Route path='/movies/:id' element={<EditMovie/>} />
        <Route path='/movies/add' element={<AddMovie/>} />
        <Route path='/music' element={<MusicList/>} />
        <Route path='/music/:id' element={<EditMusic/>} />
        <Route path='/music/add' element={<AddMusic/>} />
        <Route path='/artists' element={<ArtistsList/>} />
        <Route path='/artists/:id' element={<EditArtist/>} />
        <Route path='/artists/add' element={<AddArtist/>} />
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/return' element={<Return/>}/>
        <Route path='/circulation' element={<CirculationList/>} />
        <Route path='/billing' element={<BillingList/>} />
        <Route path='/users' element={<UsersList/>} />
        <Route path='/users/add' element={<AddUser/>} />
        <Route path='/users/:id' element={<EditUser/>} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
