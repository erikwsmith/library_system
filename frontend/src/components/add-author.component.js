import {React, useState, useRef} from 'react';
const {Button} = require('react-bootstrap');

const AddAuthor = () =>{

    const [last_name, setLastName] = useState('');
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [full_name, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const[error, setError] = useState(null);
    const lastNameRef = useRef();
    const firstNameRef = useRef();

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
    const handleSubmit = async(e) => {
        e.preventDefault();

        checkValidity(lastNameRef);
        checkValidity(firstNameRef);

        const author = {last_name, first_name, middle_name, full_name, biography};
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
            console.log('New Author Added!', json);  
            window.location='/authors';
        };
    };
    const updateFullName = (event, authorName) => {
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
    return (
        <div className="container mt-4">
            <h2>Add an Author</h2>
            <form onSubmit={handleSubmit}>
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
                        <textarea className="form-control" id="biography" rows="4" value={biography} 
                            onChange={(e)=>setBiography(e.target.value)}/>
                    </div>
                </div>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button type="submit" className="btn btn-default add-book-button fs-6">Submit</Button>
                    <a href="/authors"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
        </div>
    )
    };
export default AddAuthor;