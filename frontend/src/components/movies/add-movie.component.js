import {React, useState, useEffect, useRef} from 'react';
import Multiselect from 'multiselect-react-dropdown';
const {Button, Modal} = require('react-bootstrap');

const AddMovie = () =>{    
    const[error, setError] = useState(null);
    const [show, setShow] = useState(false);    
    const [title, setTitle] = useState('');    
    const [image, setImage] = useState('');    
    const [rating, setRating] = useState('');  
    const [runtime, setRuntime] = useState(null);  
    const [releaseDate, setReleaseDate] = useState(null);  
    const [format, setFormat] = useState('');  
    const [status, setStatus] = useState('');
    const [holds, setHolds] = useState([]);
    const [holdCount, setHoldCount] = useState(0);   

    const handleSubmit = async(e) => {
        e.preventDefault();
        const movie = {title, image, format, runtime, releaseDate, rating, type: 'Movie'};
        const response = await fetch('http://localhost:4000/movies/add', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();

        if(!response.ok){
            setError(json.error);
        }
        //reset form if OK
        if(response.ok){
            setTitle('');
            setImage('');
            setFormat('');
            setRuntime(null);
            setRating('');
            setReleaseDate(null);            
            setError(null);
            console.log('New Movie Added!', json);  
            window.location='/movies';
        }
    }
    const checkValidity = (element) => {   
        console.log(element);
            if(element.current.value === ''){
                if(element.current.classList.contains('is-valid')){element.current.classList.remove('is-valid')};
                element.current.classList.add('is-invalid');                
                return;
            }else{
                if(element.current.classList.contains('is-invalid')){element.current.classList.remove('is-invalid')};
                element.current.classList.add('is-valid');             
            };
    };
    const handleClose = () => {setShow(false)}
    const handleShow = () => setShow(true);

    return (
        <div className="container">
            <h2>Add a Movie</h2>
            <form onSubmit={handleSubmit}> 
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-6 mt-3">
                    <label htmlFor="ex1" className="fw-bold">Movie Title</label>
                        <input className="form-control" id="ex1" type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    </div>
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label htmlFor="ex2" className="fw-bold">Cover Image URL</label>
                        <input className="form-control" id="ex2" type="text" value={image} onChange={(e)=>setImage(e.target.value)}/>                    
                    </div>  
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex3" className="fw-bold">Rating</label>
                        <select className="form-select" id="ex3" value={rating} onChange={e => setRating(e.target.value)}>
                            <option></option>
                            <option>G</option>
                            <option>PG</option>   
                            <option>PG-13</option>
                            <option>R</option>                    
                        </select>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex4" className="fw-bold">Released</label>
                        <input className="form-control" id="ex4" type="number" onChange={e => setReleaseDate(e.target.value)}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex5" className="fw-bold">Runtime (minutes)</label>
                        <input className="form-control" id="ex5" type="number" onChange={e => setRuntime(e.target.value)} />
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex6" className="fw-bold">Format</label>
                        <select className="form-select" id="ex6" value={format} onChange={e => setFormat(e.target.value)}>
                            <option></option>
                            <option>Blu-Ray</option>
                            <option>DVD</option>                        
                        </select>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="bookStatus" className="fw-bold">Status</label>
                        <input className="form-control" id="bookStatus" type="text" readOnly defaultValue={'Available'}/>
                    </div>  
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label htmlFor="ex7" className="fw-bold">Holds</label>
                        <div class="input-group">
                            <span class="input-group-text">{holdCount}</span>
                            <select className="form-select" id="ex7" value={holds} readOnly>
                        {holds && holds.map((item) => (                            
                                <option>{item}</option>
                            )
                        )}                      
                        </select>
                        </div>
                    </div>  
                </div>        
                <br/>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button type="submit" className="btn btn-default add-book-button fs-6">Submit</Button>
                    <a href="/movies"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
        </div>
    )
};

export default AddMovie;