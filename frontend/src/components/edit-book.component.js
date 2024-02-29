import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

const {Button, Modal} = require('react-bootstrap');

const EditBook = () => {
    const {id} = useParams();
    const[error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [showUpdateModal, setShowUpdateModel] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [book, setBook] = useState([]);
    const [title, setTitle] = useState('');    
    const [image, setImage] = useState('');
    const [isbn, setISBN] = useState(null);
    const [pages, setPages] = useState(null);
    const [classification, setClassification] = useState('');
    const [binding, setBinding] = useState('');
    const [author, setAuthor] = useState('');
    const [authorList, setAuthorList] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [full_name, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const lastNameRef = useRef();
    const firstNameRef = useRef();
    // fetch records from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{          
            //get all books
            const bookQuery = await fetch('http://localhost:4000/books/' + id);
            let bookJson = await bookQuery.json();
            if(bookQuery.ok) {                 
                setBook(bookJson);
                setTitle(book.title);
                setPages(book.pages);
                setBinding(book.binding);  
                setISBN(book.isbn);
                setImage(book.image);    
                setClassification(book.classification);   
                setCreatedAt(book.createdAt);
                setAuthor(book.author);
            };            
        };
        const fetchAuthors = async() => {
            const response = await fetch('http://localhost:4000/authors');
            const json = await response.json();
            if(response.ok){
                setAuthorList(json);
            }
        };
        const mapAuthors = () => {
            let selectedAuthorsArr = [];
            for (let i = 0; i < authorList.length; i++){
                authorList.map((obj)=>{
                    if(obj._id === book.author[i]){
                        selectedAuthorsArr.push(obj);
                    }
                })
            }
            setSelectedAuthors(selectedAuthorsArr);
        }
        fetchAuthors();
        fetchData();
        mapAuthors();
    }, [createdAt, full_name]);

    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleUpdateShow = () => setShowUpdateModel(true);
    const handleUpdateClose = () => setShowUpdateModel(false);
    const handleSubmit = () => {};
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
    const submitAuthor = async(e) => {
        e.preventDefault();  
        checkValidity(lastNameRef);
        checkValidity(firstNameRef);
        
        const author = {first_name, last_name, middle_name, full_name, biography};
        const response = await fetch('http://localhost:4000/authors/add', {
            method: 'POST',
            body: JSON.stringify(author),
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
            clearAuthorForm();
            console.log('New Author Added!', json);     
            handleClose();         
        }
    }   
    const clearAuthorForm = ()=> {
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setFullName('');
        setBiography('');  
    };
    const handleUpdate = () =>{
        handleUpdateShow();
    };
    const updateBook = async() =>{
        const book = {title, image, isbn, pages, author, binding, classification};
        const response = await fetch('http://localhost:4000/books/' + id, {
            method: 'PATCH',
            body: JSON.stringify(book),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){
            window.location = '/books';
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
    return(
        <div className="container mt-4">
        <div className = "book-wrapper">
            <img src={image}></img>
            <h2>{title}</h2>
        </div>
        <form>
            <div className="form-group row">
                <div className="col-xs-12 col-lg-6 mt-3">
                <label htmlFor="ex1" className="fw-bold">Book Title</label>
                    <input className="form-control" id="ex1" type="text" defaultValue={title} onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className="col-xs-12 col-lg-6 mt-3">
                    <label htmlFor="ex2" className="fw-bold">Cover Image URL</label>
                    <input className="form-control" id="ex2" type="text" defaultValue={image} onChange={e => setImage(e.target.value)}/>                    
                </div>                    
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex3" className="fw-bold">ISBN</label>
                    <input className="form-control" id="ex3" type="text" defaultValue={isbn}/>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="classification" className="fw-bold">Classification</label>
                    <select className="form-select" id="classification" value={classification} onChange={e => setClassification(e.target.value)}>
                        <option></option>
                        <option>Fiction</option>
                        <option>Non-Fiction</option>                        
                    </select>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex6" className="fw-bold">Format</label>
                    <select className="form-select" id="ex6" value={binding} onChange={e => setBinding(e.target.value)}>
                        <option></option>
                        <option>Paperback</option>
                        <option>Hardcover</option>
                        <option>Audio Book</option>
                        <option>eBook</option>
                    </select>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex5" className="fw-bold">Pages</label>
                    <input className="form-control" id="ex5" type="number" defaultValue={pages} onChange={e => setPages(e.target.value)}/>
                </div>  
                <div className="author-select col-12 mt-3">                       
                    <label htmlFor="ex4" className="fw-bold">Author</label>
                    <div className="input-group">
                        <Multiselect                                                 
                        onKeyPressFn={function noRefCheck() {}}       
                        onRemove={(event)=>{
                            setAuthor(event);
                        }}   
                        onSelect={(list, item)=>{
                            setAuthor(list);
                        }}                                      
                        onSearch={function noRefCheck() {}}     
                        options={
                            authorList
                        }
                        displayValue='full_name'
                        avoidHighlightFirstOption={true}
                        closeIcon='cancel'
                        placeholder='Select an Author'     
                        selectedValues={selectedAuthors}                       
                        >                                       
                        </Multiselect>
                        <button className="btn btn-success text-white btn-outline-default" type="button" onClick={handleShow}>
                            <i className="fa fa-plus"></i>
                        </button>    
                    </div> 
                </div>                        
            </div>
            <br/>
            <div className="col-12 mt-4 mx-auto text-center">
                <Button className="btn btn-default add-book-button fs-6" onClick={handleUpdate}>Update</Button>
                <a href="/books"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
            </div>
        </form>
        <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false'>
            <Modal.Body>
                <div className = "fw-bold text-center fs-5">Add a New Author</div>
                <div className="mb-3 mt-3 row">
                    <label htmlFor="lastName" className="col-sm-3 col-form-label">Last Name</label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control needs-validation" id="lastName"
                        ref={lastNameRef} required value={last_name} 
                        onChange={(e)=>{setLastName(e.target.value); updateFullName(e, "last_name");
                                    checkValidity(lastNameRef)}}
                        />
                    </div>                            
                </div>
                <div className="mb-3 mt-3 row">
                    <label htmlFor="firstName" className="col-sm-3 col-form-label">First Name</label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control" id="firstName" value={first_name} 
                        ref={firstNameRef} required
                        onChange={(e)=>{setFirstName(e.target.value); updateFullName(e, "first_name");
                                    checkValidity(firstNameRef)}}/>
                    </div>                            
                </div>
                <div className="mb-3 mt-3 row">
                    <label htmlFor="middleName" className="col-sm-3 col-form-label">Middle Name</label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control" id="middleName" value={middle_name} 
                        onChange={(e)=>{setMiddleName(e.target.value); updateFullName(e, "middle_name")}}/>
                    </div>                            
                </div>
                <div className="mb-3 mt-3 row">
                    <label htmlFor="fullName" className="col-sm-3 col-form-label" >Full Name</label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control" id="fullName" disabled="true" value={full_name} 
                        onChange={(e)=>setFullName(e.target.value)}/>
                    </div>                            
                </div> 
                <div className="mb-3 mt-3 row">
                    <label htmlFor="Biography" className="col-sm-3 col-form-label">Biography</label>
                    <div className="col-sm-9">
                    <textarea className="form-control" id="biography" rows="4" value={biography} 
                        onChange={(e)=>setBiography(e.target.value)}/>
                    </div>                            
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={submitAuthor} className="fw-bold btn-info mx-auto author-button">
                Add Author
                </Button>
                <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">
                Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={showUpdateModal} onHide={handleClose} backdrop='static' keyboard='false'>
                <Modal.Body>
                    <div className="fw-bold fs-4 text-center">Save all changes?</div>                
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={updateBook} className=" btn-success mx-auto author-button">
                    Save
                    </Button>
                    <Button onClick={handleUpdateClose} className=" btn-secondary mx-auto author-button">
                    Cancel
                    </Button>
                </Modal.Footer>
                </Modal>
        </div> 
    )
};
export default EditBook;