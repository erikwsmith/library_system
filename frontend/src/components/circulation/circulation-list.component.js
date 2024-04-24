import { useEffect, useState} from 'react'
const {Button, Modal} = require('react-bootstrap');

const CicrulationList = () => {
    const [searchVal, setSearchVal] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [books, setBooks] = useState([]);
    const [music, setMusic] = useState([]);
    const [movies, setMovies] = useState([]);
    const [circulation, setCirculation] = useState([]);

    const goToAddCirculation = () => {window.location='/circulation/add'};

    const formatDate = (date) => {
        if(date){  
            const dateStr = date.toString();
            const timeIndex = date.indexOf('T');           
            const _date = dateStr.substring(0,timeIndex);
            const [year, month, day] = _date.split('-');
            return month + '/' + day + '/' + year;
        }
    }         
    useEffect(()=>{
        const fetchCirculation = async() => {
            const response = await fetch('http://localhost:4000/circulation');
            const json = await response.json();
            if(response.ok){
                setCirculation(json);                    
            }
        };      
        const fetchUsers = async() => {
            const response = await fetch('http://localhost:4000/users');
            const json = await response.json();
            if(response.ok){
                setUsersList(json);                    
            }
        };        
        const fetchBooks = async() => {
            const response = await fetch('http://localhost:4000/books');
            const json = await response.json();
            if(response.ok){
                setBooks(json);                    
            }
        };
        const fetchMovies = async() => {
            const response = await fetch('http://localhost:4000/movies');
            const json = await response.json();
            if(response.ok){
                setMovies(json);                    
            }
        };
        const fetchMusic = async() => {
            const response = await fetch('http://localhost:4000/music');
            const json = await response.json();
            if(response.ok){
                setMusic(json);                    
            }
        };
        fetchCirculation();
        fetchUsers();
        fetchBooks();
        fetchMovies();
        fetchMusic();
    }, []);
    return (
        <div className="container">
        <div id="pageTitle">
            <h1>Circulation</h1>  
            <div className="input-group search-bar">                    
                <input type="text" className="form-control " placeholder="Search..." 
                    onChange={
                        (e) => {
                            setSearchVal(e.target.value);
                        }
                    }
                />
                <button className="btn btn-success" type="button" id="button-addon2" onClick={goToAddCirculation}>
                    <i className="fa fa-plus"></i>
                    <span className="ms-2">Add</span>
                </button>
            </div>   
        </div> 
        <table className="table table-hover ">
                <thead>
                    <tr>
                        <th>User Account</th>                        
                        <th>Call Number</th>
                        <th>Title</th>  
                        <th>Type</th>
                        <th>Checkout</th>
                        <th>Due Date</th>
                        <th>Returned</th>
                        <th>Edit</th>                        
                        <th>Delete</th>                       
                    </tr>
                </thead>
                <tbody>
                    {circulation && circulation.map((item)=>(
                        <tr key={item._id}>
                            <td className="align-middle">{item.userAccount}</td>
                            <td className="align-middle">{item.itemID}</td>
                            <td className="align-middle">{item.itemTitle}</td>
                            <td className="align-middle">{item.itemType}</td>                            
                            <td className="align-middle">{formatDate(item.checkoutDate)}</td>
                            <td className="align-middle">{formatDate(item.dueDate)}</td>
                            <td className="align-middle">{formatDate(item.returnDate)}</td>
                            <td className="align-middle actionButtons">
                                <a href={"/"} className="btn btn-sm btn-primary" data-bs-toggle="tooltip" 
                                    data-bs-placement="bottom" title="Edit">
                                        <i className="fa fa-pencil editIcon"></i>
                                </a>
                            </td>
                            <td className="align-middle actionButtons">
                                <Button className="btn btn-sm btn-danger" data-bs-toggle="tooltip" 
                                    data-bs-placement="bottom" title="Delete" >
                                        <i className="fa fa-trash-o trashIcon"></i>
                                </Button>
                            </td>                            
                        </tr>                    
                    ))}
                </tbody>
            </table>         
    </div> 
    );
};
export default CicrulationList;