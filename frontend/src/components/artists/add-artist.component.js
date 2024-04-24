import {React, useState, useRef} from 'react';
const {Button} = require('react-bootstrap');

const AddArtist = () =>{
    
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [group_name, setGroupName] = useState('');
    const [full_name, setFullName] = useState('');
    const [biography, setBiography] = useState(''); 
    const lastNameRef = useRef();
    const firstNameRef = useRef();
    const groupNameRef = useRef();
    const[error, setError] = useState(null);

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
        const artist = {group_name, full_name, biography};
        const response = await fetch('http://localhost:4000/artists/add', {
            method: 'POST',
            body: JSON.stringify(artist),
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
            console.log('New Artist Added!', json);  
            window.location='/artists';
        };
    };
    const updateFullName = (event, artistName)=> { 
        if(artistName === 'first_name'){
            setFullName(last_name + ', ' + event.target.value + ' ' + middle_name);
        };
        if(artistName === 'middle_name'){
            setFullName(last_name + ', ' + first_name + ' ' + event.target.value);
        };
        if(artistName === 'last_name'){
            setFullName(event.target.value + ', ' + first_name + ' ' + middle_name);
        };
        if(artistName === 'group_name'){
            setFullName(event.target.value)
        }
    };
    return (
        <div className="container">
            <h2>Add an Artist</h2>
            <form onSubmit={handleSubmit}>
                <br/>
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex1" className="fw-bold">Group Name</label>
                        <input className="form-control" id="ex1" type="text" value={group_name} ref={groupNameRef} 
                            onChange={(e)=>{setGroupName(e.target.value); updateFullName(e, "group_name");checkValidity(groupNameRef)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex1" className="fw-bold">Last Name</label>
                        <input className="form-control" id="ex1" type="text" value={last_name} ref={lastNameRef} 
                            onChange={(e)=>{setLastName(e.target.value); updateFullName(e, "last_name");checkValidity(lastNameRef)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex1" className="fw-bold">First Name</label>
                        <input className="form-control" id="ex2" type="text" value={first_name} ref={firstNameRef} 
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
                    <a href="/artists"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
        </div>
    )
    };
export default AddArtist;