import {React, useState, useEffect, useRef} from 'react';
import Multiselect from 'multiselect-react-dropdown';
const {Button, Modal} = require('react-bootstrap');

const AddBook = () =>{
    const[title, setTitle] = useState('');
    const[image, setImage] = useState('');
    const[isbn, setISBN] = useState('');
    const[author, setAuthor] = useState([]);
    const [status, setStatus] = useState('Available');
    const [holds, setHolds] = useState([]);
    const [holdCount, setHoldCount] = useState(0);
    const [usersList, setUsersList] = useState([]);
    const[authorList, setAuthorList] = useState([]); 
    const[pages, setPages] = useState(null);
    const[binding, setBinding] = useState('');
    const[classification, setClassification] = useState('');
    const[error, setError] = useState(null);
    const[show, setShow] = useState(false);
    const[first_name, setFirstName] = useState('');
    const[middle_name, setMiddleName] = useState('');
    const[last_name, setLastName] = useState('');
    const[full_name, setFullName] = useState('');
    const[biography, setBiography] = useState('');
    const[summary, setSummary] = useState('');
    const[callNumber, setCallNumber] = useState('');
    
    const lastNameRef = useRef();
    const firstNameRef = useRef();

    useEffect(()=>{
        const fetchAuthors = async() => {
            //const response = await fetch('http://localhost:4000/authors');
            const response = await fetch('https://library-system-rydv.onrender.com/authors');
            const json = await response.json();
            if(response.ok){
                setAuthorList(json);
            }
        };
        fetchAuthors();
    }, [full_name]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const book = {title, image, isbn, author, pages, classification, binding, type: 'Book', callNumber, summary};
        //const response = await fetch('http://localhost:4000/books/add', {
        const response = await fetch('https://library-system-rydv.onrender.com/books/add', {
            method: 'POST',
            body: JSON.stringify(book),
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
            setISBN('');
            setPages(null);
            setBinding('');
            setAuthorList([]);
            setAuthor([]);
            setError(null);
            console.log('New Book Added!', json);  
            window.location='/books';
        }
    }
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
    const clearAuthorForm = ()=> {
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setFullName('');
        setBiography('');  
    };
    const submitAuthor = async(e) => {
        e.preventDefault();  

        checkValidity(lastNameRef);
        checkValidity(firstNameRef);
        
        const author = {first_name, last_name, middle_name, full_name, biography};
        //const response = await fetch('http://localhost:4000/authors/add', {
        const response = await fetch('https://library-system-rydv.onrender.com/authors/add', {
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
    const handleClose = () => {setShow(false); clearAuthorForm();}
    const handleShow = () => setShow(true);
    const findUserNameAndID = (id) => {
        for(let i = 0; i < usersList.length; i++){
            if (id === usersList[i]._id){
                return usersList[i].full_name + ' (User ID: ' + usersList[i].user_id + ')';
            }
        }
    }
    return(
        <div className="container">
        <h2>Add a Book</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group row">
                <div className="col-xs-12 col-lg-6 mt-3">
                <label htmlFor="ex1" className="fw-bold">Book Title</label>
                    <input className="form-control" id="ex1" type="text" required value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="col-xs-12 col-lg-6 mt-3">
                    <label htmlFor="ex2" className="fw-bold">Cover Image URL</label>
                    <input className="form-control" id="ex2" type="text" value={image} onChange={(e)=>setImage(e.target.value)}/>                    
                </div>         
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex3" className="fw-bold">Call Number</label>
                    <input className="form-control" id="ex3" type="text" value={callNumber}
                        onChange={e => setCallNumber(e.target.value)}/>
                </div>                  
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex3" className="fw-bold">ISBN</label>
                    <input className="form-control" id="ex3" type="text" required value={isbn} onChange={(e)=>setISBN(e.target.value)}/>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="classification" className="fw-bold">Classification</label>
                    <select className="form-select" id="classification" onChange={(e)=>setClassification(e.target.value)}>
                        <option></option>
                        <option>Fiction</option>
                        <option>Non-Fiction</option>                        
                    </select>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex6" className="fw-bold">Format</label>
                    <select className="form-select" id="ex6" onChange={(e)=>setBinding(e.target.value)}>
                        <option></option>
                        <option>Paperback</option>
                        <option>Hardcover</option>
                        <option>Audio Book</option>
                        <option>eBook</option>
                    </select>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex5" className="fw-bold">Pages</label>
                    <input className="form-control" id="ex5" type="number" value={pages} onChange={(e)=>setPages(e.target.value)}/>
                </div>
                <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="bookStatus" className="fw-bold">Status</label>
                    <input className="form-control" id="bookStatus" type="text" disabled readOnly defaultValue={status}/>
                </div>  
                <div className="col-xs-12 col-lg-6 mt-3">
                        <label htmlFor="ex5" className="fw-bold">Holds</label>
                        <div className="input-group">
                            <span className="input-group-text">{holdCount}</span>
                            <select className="form-select" id="ex5" value={holds} readOnly>
                        {holds && holds.map((item) => (                            
                                <option>{findUserNameAndID(item)}</option>
                            )
                        )}                      
                        </select>
                        </div>
                </div> 
                <div className="col-xs-12 col-lg-12 mt-3">
                    <label htmlFor="bookSummary" className="fw-bold">Summary</label>
                    <textarea className="form-control" id="bookSummary" rows="3" value={summary} 
                        onChange={e => setSummary(e.target.value)}/>
                </div>  
                <div className="author-select col-12 mt-3">                       
                    <label htmlFor="ex4" className="fw-bold">Author</label>
                    <div className="input-group">
                        <Multiselect                                                 
                        onKeyPressFn={function noRefCheck() {}}       
                        onRemove={(event)=>{
                            setAuthor(event);
                            console.log(author);
                        }}   
                        onSelect={(list, item)=>{
                            setAuthor(list);
                            console.log(author); 
                        }}                                      
                        onSearch={function noRefCheck() {}}     
                        options={
                            authorList
                        }
                        displayValue='full_name'
                        avoidHighlightFirstOption={true}
                        closeIcon='cancel'
                        placeholder='Select an Author'                            
                        >                                       
                        </Multiselect>
                        <button className="btn btn-success text-white btn-outline-default" type="button" onClick={handleShow}>
                            <i className="fa fa-plus"></i>
                        </button>
                        <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75 }}>
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
                    </div>
                </div>                
            </div>
            <br/>
            <div className="col-12 mt-4 mx-auto text-center">
                <Button type="submit" className="btn btn-default add-book-button fs-6">Submit</Button>
                <a href="/books"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
            </div>
        </form>
        </div> 
    );
    };
export default AddBook;