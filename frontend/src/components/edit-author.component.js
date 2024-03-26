import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
const {Button, Modal} = require('react-bootstrap');

const EditAuthor = () => {
    const {id} = useParams();
    const [author, setAuthor] = useState([]);
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [full_name, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [show, setShow] = useState(false);
    const lastNameRef = useRef();
    const firstNameRef = useRef();
    const[error, setError] = useState(null);
    
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleUpdate = () =>{
        if(!last_name == '' && !first_name == ''){
            handleShow();
        };
    };
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
    const updateFullName = (event, authorName)=> { 
        if(authorName === 'first_name'){
            setFullName(last_name + ', ' + event.target.value + ' ' + middle_name);
        };
        if(authorName === 'middle_name'){
            setFullName(last_name + ', ' + first_name + ' ' + event.target.value);
        };
        if(authorName === 'last_name'){
            setFullName(event.target.value + ', ' + first_name + ' ' + middle_name);
        };
    };
    const updateAuthor = async() =>{        
        const author = {last_name, first_name, middle_name, full_name, biography};
        const response = await fetch('http://localhost:4000/authors/' + id, {
            method: 'PATCH',
            body: JSON.stringify(author),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){
            window.location = '/authors';
        };
    };
    useEffect( ()=>{
        const fetchData = async()=>{          
            //get author
            const authorQuery = await fetch('http://localhost:4000/authors/' + id);
            let authorJson = await authorQuery.json();
            if(authorQuery.ok) {                 
                setAuthor(authorJson);
                setLastName(author.last_name);
                setFirstName(author.first_name);
                setMiddleName(author.middle_name);
                setFullName(author.full_name);
                setBiography(author.biography);
                setCreatedAt(author.createdAt);
            };            
        };        
        fetchData();        
    }, [createdAt]);

    return (
        <div className="container mt-4">            
            <h2>Author: <span className="author-heading">{full_name}</span></h2>            
            <form>
                <br/>
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex1" className="fw-bold">Last Name</label>
                        <input className="form-control" id="ex1" type="text" value={last_name} ref={lastNameRef} required
                            onChange={(e)=>{setLastName(e.target.value); updateFullName(e, "last_name");checkValidity(lastNameRef)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex1" className="fw-bold">First Name</label>
                        <input className="form-control" id="ex2" type="text" value={first_name} ref={firstNameRef} required
                            onChange={(e)=> {setFirstName(e.target.value); updateFullName(e, "first_name");checkValidity(firstNameRef)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex1" className="fw-bold">Middle Name</label>
                        <input className="form-control" id="ex3" type="text" value={middle_name}
                            onChange={(e)=> {setMiddleName(e.target.value); updateFullName(e, "middle_name");}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex1" className="fw-bold">Full Name</label>
                        <input className="form-control" id="ex4" type="text" disabled="true" value={full_name} 
                            onChange={(e)=>setFullName(e.target.value)}/>
                    </div>
                    <div className="col-xs-12 col-lg-12 mt-3">
                        <label htmlFor="ex1" className="fw-bold">Biography</label>
                        <textarea className="form-control" id="biography" rows="8" value={biography} 
                        onChange={(e)=>setBiography(e.target.value)}/>
                    </div>
                </div>
                <br/>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button className="btn btn-default add-book-button fs-6" onClick={handleUpdate}>Update</Button>
                    <a href="/authors"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false'>
                <Modal.Body>
                    <div className="fw-bold fs-4 text-center">Save all changes?</div>                
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={updateAuthor} className=" btn-success mx-auto author-button">Save</Button>
                        <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )   
};

export default EditAuthor;