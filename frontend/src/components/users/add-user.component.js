import {React, useState, useRef} from 'react';
import DatePicker from "react-datepicker";

const {Button} = require('react-bootstrap');

const AddUser = () =>{

    const [last_name, setLastName] = useState('');
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [full_name, setFullName] = useState('');
    const [user_type, setUserType] = useState('');
    const [user_id, setUserID] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
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

        //checkValidity(lastNameRef);
        //checkValidity(firstNameRef);

        const user = {last_name, first_name, middle_name, full_name, user_type, user_id, birthdate, username, password};
        const response = await fetch('http://localhost:4000/users/add', {
            method: 'POST',
            body: JSON.stringify(user),
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
            console.log('New User Added!', json);  
            window.location='/users';
        };
    };
    const updateFullName = (event, userName) => {
        if(userName === 'first_name'){
            setFullName(last_name + ', ' + event.target.value + ' ' + middle_name);
        };
        if(userName === 'middle_name'){
            setFullName(last_name + ', ' + first_name + ' ' + event.target.value);
        };
        if(userName === 'last_name'){
            setFullName(event.target.value + ', ' + first_name + ' ' + middle_name);
        };
    };
    return(
        <div className="container">
            <h2>Add a User</h2>
            <form onSubmit={handleSubmit}>
                <br/>
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="userID" className="fw-bold">User ID</label>
                        <input className="form-control" id="userID" type="number" value={user_id} required
                            onChange={(e)=>{setUserID(e.target.value)}}/>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="username" className="fw-bold">Username</label>
                        <input className="form-control" id="username" type="text" value={username} required
                            onChange={(e)=>{setUsername(e.target.value)}}/>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="password" className="fw-bold">Password</label>
                        <input className="form-control" id="password" type="text" value={password} required
                            onChange={(e)=>{setPassword(e.target.value)}}/>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="userType" className="fw-bold">User Type</label>
                        <select className="form-select" id="userType" onChange={(e)=>setUserType(e.target.value)}>
                            <option></option>                    
                            <option>Administrator</option>
                            <option>Patron</option>                        
                        </select>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="lastname" className="fw-bold">Last Name</label>
                        <input className="form-control" id="lastname" type="text" value={last_name} ref={lastNameRef} required
                            onChange={(e)=>{setLastName(e.target.value); updateFullName(e, "last_name");checkValidity(lastNameRef)}}/>
                    </div>                
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="firstname" className="fw-bold">First Name</label>
                        <input className="form-control" id="firstname" type="text" value={first_name} ref={firstNameRef} required
                            onChange={(e)=> {setFirstName(e.target.value); updateFullName(e, "first_name");checkValidity(firstNameRef)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="middlename" className="fw-bold">Middle Name</label>
                        <input className="form-control" id="middlename" type="text" value={middle_name}
                            onChange={(e)=> {setMiddleName(e.target.value); updateFullName(e, "middle_name");}}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="fullname" className="fw-bold">Full Name</label>
                        <input className="form-control" id="fullname" type="text" disabled = {true} value={full_name} 
                            onChange={(e)=>setFullName(e.target.value)}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="birthdate" className="fw-bold">Birth Date</label>
                        <input id="birthdate" className="form-control" type="date" value={birthdate} 
                           onChange={(e)=>setBirthdate(e.target.value)}  />
                    </div>
                </div>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button type="submit" className="btn btn-default add-book-button fs-6">Submit</Button>
                    <a href="/users"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
        </div>
    );
};

export default AddUser;