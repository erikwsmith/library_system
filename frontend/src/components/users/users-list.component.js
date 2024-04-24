import { useEffect, useState} from 'react'
const {Button, Modal} = require('react-bootstrap');

const UsersList = () => {

    const [users, setUsers] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [deletedName, setDeletedName] = useState("");
    const [deletedID, setDeletedID] = useState("");
    const [deletedUser, setDeletedUser] = useState('');
    const [show, setShow] = useState(false);
    const [deletedUserID, setDeletedUserID] = useState('');

    const handleShow = () => {setShow(true)};
    const handleAddUser = () => {window.location='/users/add'};
    const handleDelete = (event) => {
        handleShow();
        let parentEl = event.target.parentElement.parentElement;
        if(parentEl.hasAttributes()){
            parentEl = parentEl.parentElement;
        };        
        let fullName = parentEl.getElementsByTagName("td")[2].innerText;
        let routeID = parentEl.getElementsByTagName("td")[6].firstChild.getAttribute("href");
        let userID = parentEl.getElementsByTagName("td")[0].innerText;
        setDeletedName(fullName);
        setDeletedID(routeID);
        setDeletedUserID(userID);
    };
    const handleClose = () => {setShow(false);}
    const formatDate = (date) => {
        let newDate = new Date(date);
        newDate.setMinutes = (newDate.getMinutes() + newDate.getTimezoneOffset());
        return newDate.toLocaleDateString('en-US', {timeZone: 'utc'});
    };
    const deleteUser = async() => {
        const idString = 'http://localhost:4000'+ deletedID;
        await fetch(idString, {
            method: 'DELETE'            
        }).then(setDeletedID(deletedID)).then(handleClose);        
    };
    // fetch records from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{
            //get all users
            const userQuery = await fetch('http://localhost:4000/users');
            const userJson = await userQuery.json();  
            if(userQuery.ok) { 
                const filterResults = userJson.filter((item)=> {                           
                    if (item.full_name.toLowerCase().includes(searchVal.toLowerCase()) ||
                    item.user_type.toLowerCase().includes(searchVal.toLowerCase()) || 
                    item.username.toLowerCase().includes(searchVal.toLowerCase()) ||
                    item.password.toLowerCase().includes(searchVal.toLowerCase()) ||
                    formatDate(item.birthdate).toLowerCase().includes(searchVal.toLowerCase())                
                    ) {
                        return item;
                    }
                });            
                setUsers(filterResults);
            };                        
        };
        fetchData();
    }, [searchVal, show]);

    return (
        <div className="container">
            <div id="pageTitle">
            <h1>Users</h1>  
                <div className="input-group search-bar">                    
                    <input type="text" className="form-control " placeholder="Search..." 
                        onChange={(e) => {setSearchVal(e.target.value)}}/>
                    <button className="btn btn-success" type="button" onClick={handleAddUser}>
                        <i className="fa fa-plus"></i>
                        <span className="ms-2">Add</span>
                    </button>
                </div>           
            </div>   
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>     
                        <th>Type</th>     
                        <th>Username</th>   
                        <th>Password</th>  
                        <th>Full Name</th>                 
                        <th>Birth Date</th>                         
                        <th>Edit</th>   
                        <th>Delete</th>                                
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((item)=>(
                        <tr key={item._id}>                        
                            <td className="align-middle">{item.user_id}</td>                      
                            <td className="align-middle">{item.user_type}</td> 
                            <td className="align-middle">{item.username}</td>                      
                            <td className="align-middle">{item.password}</td> 
                            <td className="align-middle">{item.full_name}</td>   
                            <td className="align-middle">{formatDate(item.birthdate)}</td>                      
                            <td className="align-middle">
                                    <a href={"/users/" + item._id} className="btn btn-sm btn-primary">
                                        <i className="fa fa-pencil editIcon"></i>
                                    </a>
                            </td>
                            <td className="align-middle actionButtons">
                                <Button className="btn btn-sm btn-danger" data-bs-toggle="tooltip" 
                                    data-bs-placement="bottom" title="Delete" onClick={(e)=> handleDelete(e)}>
                                        <i className="fa fa-trash-o trashIcon"></i>
                                </Button>
                            </td>      
                        </tr>
                    ))}
                </tbody>
                <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75}}>
                    <Modal.Body>
                        <div className="text-center fw-bold fs-4 mb-4">Are you sure you want to delete?</div>
                        <div className="fw-bold mb-3 fs-5">User ID: <span className="fw-normal">{deletedUserID}</span></div>   
                        <div className="fw-bold mb-3 fs-5">Username: <span className="fw-normal">{deletedName}</span></div>               
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={deleteUser} className="fw-bold btn-danger mx-auto author-button">
                        Delete
                        </Button>
                        <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">
                        Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </table>
        </div>
    );
};

export default UsersList;