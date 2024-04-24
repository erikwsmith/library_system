import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
const {Button, Modal} = require('react-bootstrap');

const EditUser = () => {
    const {id} = useParams();
    const [user, setUser] = useState([]);
    const [last_name, setLastName] = useState('');
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [full_name, setFullName] = useState('');
    const [user_type, setUserType] = useState('');
    const [user_id, setUserID] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());    
    const [createdAt, setCreatedAt] = useState('');
    const [show, setShow] = useState(false);
    const[error, setError] = useState(null);
    const lastNameRef = useRef();
    const firstNameRef = useRef();

    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleUpdate = () =>{
        if(!last_name == '' && !first_name == '' && !username == '' && !password == ''){
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
    const updateFullName = (event, userName)=> { 
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
    const updateUser = async() =>{        
        const user = {last_name, first_name, middle_name, full_name, user_id, user_type, username, password, birthdate};
        const response = await fetch('http://localhost:4000/users/' + id, {
            method: 'PATCH',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){
            window.location = '/users';
        };
    };

    useEffect( ()=>{
        const fetchData = async()=>{          
            //get user
            const userQuery = await fetch('http://localhost:4000/users/' + id);
            let userJson = await userQuery.json();
            if(userQuery.ok) {                 
                setUser(userJson);
                setLastName(user.last_name);
                setFirstName(user.first_name);
                setMiddleName(user.middle_name);
                setFullName(user.full_name);                
                setUserID(user.user_id);
                setUserType(user.user_type);
                setUsername(user.username);
                setPassword(user.password);
                setCreatedAt(user.createdAt);
                
                let d = new Date(user.birthdate);
                let date = [d.getFullYear(), ('0'+(d.getMonth() + 1)).slice(-2), ('0' + (d.getDate() + 1)).slice(-2)].join('-');
                setBirthdate(date);
            };            
        };        
        fetchData();        
    }, [createdAt]);

    return(
        <div className="container">
            <h2>User: <span className="user-heading">{full_name}</span></h2>            
            <form>
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
                        <select className="form-select" id="userType" value={user_type} onChange={(e)=>setUserType(e.target.value)}>
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
                           onChange={(e)=>{setBirthdate(e.target.value)}}  />
                    </div>
                    <br/>
                    <div className="col-12 mt-4 mx-auto text-center">
                        <Button className="btn btn-default add-book-button fs-6" onClick={handleUpdate}>Update</Button>
                        <a href="/users"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                    </div>
                </div>
            </form>                
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75}}>
                <Modal.Body>
                    <div className="fw-bold fs-4 text-center">Save all changes?</div>                
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={updateUser} className=" btn-success mx-auto author-button">Save</Button>
                    <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">Cancel</Button>
                </Modal.Footer>
            </Modal>            
        </div>
    );
};
export default EditUser;