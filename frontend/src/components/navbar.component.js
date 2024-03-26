import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg p-2">
                <div className="nav-items">
                    <Link to="/" className="navbar-brand ">Library System</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/books" className="nav-link">Books</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/authors" className="nav-link">Authors</Link>
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
};