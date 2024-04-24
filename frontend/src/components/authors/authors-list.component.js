import { useEffect, useState} from 'react'
const {Button, Modal} = require('react-bootstrap');

const AuthorsList = () => {

    const [authors, setAuthors] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [deletedName, setDeletedName] = useState("");
    const [deletedID, setDeletedID] = useState("");
    const [deleted, setDeleted] = useState('');
    const [show, setShow] = useState(false);

    const goToAddAuthor = () => {window.location='/authors/add'};
    const abbreviatedBio = (fullText) => {
        if(fullText && fullText.length > 300){
            return fullText.substring(0,300) + '...'
        }
        return fullText;
    }
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const deleteAuthor = async() => {
        const idString = 'http://localhost:4000'+ deletedID;
        await fetch(idString, {
            method: 'DELETE'            
        }).then(setDeleted(deletedID)).then(handleClose);
    };
    const handleDelete = (event) => {
        handleShow();
        let parentEl = event.target.parentElement.parentElement;
        if(parentEl.hasAttributes()){
            parentEl = parentEl.parentElement;
        };        
        let fullName = parentEl.getElementsByTagName("td")[0].innerText;
        let authorID = parentEl.getElementsByTagName("td")[2].firstChild.getAttribute("href");
        setDeletedName(fullName);
        setDeletedID(authorID);
    };
    // fetch records from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{
            //get all authors
            const authorQuery = await fetch('http://localhost:4000/authors');
            const authorJson = await authorQuery.json();  
            if(authorQuery.ok) { 
                const filterResults = authorJson.filter((item)=> {                           
                    if (item.full_name.toLowerCase().includes(searchVal.toLowerCase())                
                    ) {
                        return item;
                    }
                });            
                setAuthors(filterResults);
            };                        
        };
        fetchData();
    }, [searchVal, show]);

    return(
        <div className="container">
        <div id="pageTitle">
            <h1>Authors</h1>  
            <div className="input-group search-bar">                    
                <input type="text" className="form-control " placeholder="Search..." 
                    onChange={(e) => {setSearchVal(e.target.value)}}
                />
                <button className="btn btn-success" type="button" onClick={goToAddAuthor}>
                    <i className="fa fa-plus"></i>
                    <span className="ms-2">Add</span>
                </button>
            </div>           
        </div>               
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Full Name</th>                               
                    <th>Biography</th>  
                    <th>Edit</th>
                    <th>Delete</th>                      
                </tr>
            </thead>
            <tbody>
                {authors && authors.map((item)=>(
                    <tr key={item._id}>                        
                        <td className="align-middle authorData">{item.full_name}</td>                      
                        <td className="align-middle biography">{abbreviatedBio(item.biography)}</td>
                        <td className="align-middle">
                                <a href={"/authors/" + item._id} className="btn btn-sm btn-primary">
                                    <i className="fa fa-pencil editIcon"></i>
                                </a>
                        </td>
                        <td className="align-middle actionButtons">
                            <Button className="btn btn-sm btn-danger" data-bs-toggle="tooltip" 
                                data-bs-placement="bottom" title="Delete" onClick={handleDelete}>
                                    <i className="fa fa-trash-o trashIcon"></i>
                            </Button>
                        </td>      
                    </tr>
                ))}
            </tbody>
        </table>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4 mb-4">Are you sure you want to delete?</div>
                    <div className="fw-bold mb-3 fs-5">Author Name: <span className="fw-normal">{deletedName}</span></div>                   
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteAuthor} className="fw-bold btn-danger mx-auto author-button">
                    Delete
                    </Button>
                    <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div> 
    );
};         
export default AuthorsList;