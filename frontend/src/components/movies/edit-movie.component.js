import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
const {Button, Modal} = require('react-bootstrap');

const EditBook = () => {

    const {id} = useParams();
    const[error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [movie, setMovie] = useState([]);
    const [title, setTitle] = useState('');    
    const [image, setImage] = useState('');    
    const [rating, setRating] = useState('');  
    const [runtime, setRuntime] = useState(null);  
    const [releaseDate, setReleaseDate] = useState(null);  
    const [format, setFormat] = useState('');  
    const [status, setStatus] = useState('');
    const [callNumber, setCallNumber] = useState('');
    const [summary, setSummary] = useState('');
    const [holds, setHolds] = useState([]);
    const [holdCount, setHoldCount] = useState(0);   
    const titleRef = useRef();

    const getStatus = (item) =>{
        if(item.checkedOut === false && item.holds && item.holds.length > 0){
            return 'On Hold'
        }else if(item.checkedOut === true){
            return 'In Use'
        }else{
            return 'Available'
        };
    };
    // fetch record from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{          
            //get all movies
            const movieQuery = await fetch('http://localhost:4000/movies/' + id);
            let movieJson = await movieQuery.json();
            if(movieQuery.ok) {                 
                setMovie(movieJson);
                setTitle(movie.title);                
                setStatus(getStatus(movie));  
                setHolds(movie.holds);               
                setImage(movie.image);   
                setRating(movie.rating);
                setFormat(movie.format);  
                setRuntime(movie.runtime);
                setReleaseDate(movie.releaseDate);                  
                setCreatedAt(movie.createdAt);
                setSummary(movie.summary);
                setCallNumber(movie.callNumber);
                movie.holds && movie.holds.length > 0 ? setHoldCount(movie.holds.length): setHoldCount(0);                              
            };            
        };
         fetchData();                     
    }, [createdAt]);

    const updateMovie = async() =>{
        const movie = {title, image, rating, runtime, format, releaseDate, callNumber, summary};
        const response = await fetch('http://localhost:4000/movies/' + id, {
            method: 'PATCH',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){            
            window.location = '/movies';
        };
    };
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleUpdateShow = () => setShowUpdateModal(true);
    const handleUpdateClose = () => setShowUpdateModal(false);
    const checkValidity = (element) => {   
            if(element.current.value === ''){
                if(element.current.classList.contains('is-valid')){element.current.classList.remove('is-valid')};
                element.current.classList.add('is-invalid');                
                return;
            }else{
                if(element.current.classList.contains('is-invalid')){element.current.classList.remove('is-invalid')};
                element.current.classList.add('is-valid');             
            };
    };
    const handleUpdate = () =>{
        if(!title == ''){
            handleUpdateShow();
        }else{
            checkValidity(titleRef);
        };
    };

    return(
        <div className="container">
            <div className = "book-wrapper">                
                <img src={image}></img>
                <h2>{title}</h2>
            </div>
            <form>
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-6 mt-3">
                    <label htmlFor="ex1" className="fw-bold">Movie Title</label>
                        <input className="form-control" required id="ex1" type="text" value={title} ref={titleRef}
                            onChange={e => {setTitle(e.target.value)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label htmlFor="ex2" className="fw-bold">Cover Image URL</label>
                        <input className="form-control" id="ex2" type="text" defaultValue={image} 
                            onChange={e => setImage(e.target.value)}/>                    
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="callnumber" className="fw-bold">Call Number</label>
                        <input className="form-control" id="bookStatus" type="text" defaultValue={callNumber}
                            onChange={e => setCallNumber(e.target.value)}/>
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
                        <input className="form-control" id="ex4" type="number" defaultValue={releaseDate} 
                            onChange={e => setReleaseDate(e.target.value)}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex5" className="fw-bold">Runtime (minutes)</label>
                        <input className="form-control" id="ex5" type="number" defaultValue={runtime}
                            onChange={e => setRuntime(e.target.value)} />
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
                        <input className="form-control" id="bookStatus" type="text" disabled readOnly defaultValue={status}/>
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
                    <div className="col-xs-12 col-lg-12 mt-3">
                        <label htmlFor="movieSummary" className="fw-bold">Summary</label>
                        <textarea className="form-control" id="movieSummary" rows="3" defaultValue={summary} 
                            onChange={e => setSummary(e.target.value)}/>
                    </div>                    
                </div>
                <br/>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button className="btn btn-default add-book-button fs-6" onClick={handleUpdate}>Update</Button>
                    <a href="/movies"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form> 
            <Modal show={showUpdateModal} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75}}>
                <Modal.Body>
                    <div className="fw-bold fs-4 text-center">Save all changes?</div>                
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={updateMovie} className=" btn-success mx-auto author-button">Save</Button>
                    <Button onClick={handleUpdateClose} className=" btn-secondary mx-auto author-button">Cancel</Button>
                </Modal.Footer>
            </Modal>                  
        </div>
    )
}

export default EditBook;