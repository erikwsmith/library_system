import React, { Component } from 'react';

export default class Home extends Component {
    render(){
        return(
            <div className="homeBackground ">            
                <header className="jumbotron">
                    <div className="welcome-banner">WELCOME TO THE</div>
                    <div className="library-name">BIXBY COUNTY LIBRARY</div>    
                </header>           
            </div> 
        );
    }
};