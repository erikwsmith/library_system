import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Nav_Bar = () =>{      
        return (
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
        );
    };

export default Nav_Bar;