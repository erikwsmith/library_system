import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Nav_Bar = () =>{      
        /*return (
            <nav className="navbar fixed-top navbar-dark bg-dark navbar-expand-md p-2">
                <div className="nav-items">
                    <Link to="/" className="navbar-brand "><i className="fa fa-book site-icon"></i></Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/books" className="nav-link">Books</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/authors" className="nav-link">Authors</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/movies" className="nav-link">Movies</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/music" className="nav-link">Music</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/artists" className="nav-link">Artists</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/checkout" className="nav-link">Checkout</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/return" className="nav-link">Return</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/circulation" className="nav-link">Circulation</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/billing" className="nav-link">Billing</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/users" className="nav-link">Users</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );*/
 // adding the states 
    const [isActive, setIsActive] = useState(false);    
    const toggleActiveClass = () => {        
        //event.target.classList.toggle('navActive');
        //if(event.target.classList.contains('navActive')){event.target.classList.remove('navActive')};
        //if(!event.target.classList.contains('navActive')){event.target.classList.add('navActive')};
        setIsActive(!isActive);
    };
    const removeActive = () => {
        setIsActive(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <nav className="navbar">                    
                    <a href='/' className="navLogo"><i className="fa fa-book site-icon"></i></a>
                    <ul className={'navMenu ' +  (isActive?'navActive': '')} onClick={toggleActiveClass}>
                        <li onClick={removeActive}>
                            <a href='/books' className="navLink">Books</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/authors' className="navLink">Authors</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/movies' className="navLink">Movies</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/music' className="navLink">Music</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/artists' className="navLink">Artists</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/checkout' className="navLink">Checkout</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/return' className="navLink">Return</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/circulation' className="navLink">Circulation</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/billing' className="navLink">Billing</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='/users' className="navLink">Users</a>
                        </li>
                    </ul>
                    <div className={'hamburger ' + (isActive? 'navActive': '')} onClick={toggleActiveClass}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </nav>
            </header>
        </div>
    )
    };

export default Nav_Bar;