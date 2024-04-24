import { useEffect, useState} from 'react'
const {Button, Modal} = require('react-bootstrap');

const MoviesList = () => {
    const [searchVal, setSearchVal] = useState("");
    const [movies, setMovies] = useState([]);
    const [show, setShow] = useState(false);
    const [deletedImage, setDeletedImage] = useState('');
    const [deletedTitle, setDeletedTitle] = useState('');
    const [deletedFormat, setDeletedFormat] = useState('');
    const [deletedID, setDeletedID] = useState('');
    const [deleted, setDeleted] = useState('');

    const goToAddMovie = () => {window.location='/movies/add'};
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const deleteMovie = async() => {
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
        let image = parentEl.firstChild.firstChild.getAttribute("src");
        let title = parentEl.getElementsByTagName("td")[1].innerText;
        let format = parentEl.getElementsByTagName("td")[5].innerHTML;
        let movieID = parentEl.getElementsByTagName("td")[8].firstChild.getAttribute("href");
        setDeletedImage(image);
        setDeletedTitle(title);
        setDeletedFormat(format);
        setDeletedID(movieID);
    };
    // fetch records from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{          
            //get all movies
            const movieQuery = await fetch('http://localhost:4000/movies');
            let movieJson = await movieQuery.json();
            if(movieQuery.ok) {          
                const filterResults = movieJson.filter((item)=> {          
                    let status = '';
                    let runtime='';
                    let holdNum = '';
                    let releaseDate='';
                    item.checkedOut === false ? status = 'Available': status = 'In Use';    
                    if(item.runtime){runtime = item.runtime.toString();}
                    if(item.holds){holdNum = item.holds.toString();}
                    if(item.releaseDate){releaseDate = item.releaseDate.toString();}                                                   
                    if (item.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                        item.rating.toLowerCase().includes(searchVal.toLowerCase()) || 
                        item.format.toLowerCase().includes(searchVal.toLowerCase()) ||    
                        runtime.toLowerCase().includes(searchVal.toLowerCase()) ||
                        holdNum.toLowerCase().includes(searchVal.toLowerCase()) ||
                        releaseDate.toLowerCase().includes(searchVal.toLowerCase()) ||                  
                        status.toLowerCase().includes(searchVal.toLowerCase())
                    ) {
                        return item;
                    }
                });      
                setMovies(filterResults); 
            };            
        };
        fetchData();
    }, [searchVal, deleted] );
    const getStatus = (item) =>{
        if(item.checkedOut && item.checkedOut === false && item.holds.length > 0){
            return 'On Hold'
        }else if(item.checkedOut && item.checkedOut === true){
            return 'In Use'
        }else{
            return 'Available'
        };
    };
    return (
        <div className="container ">
            <div id="pageTitle">
                <h1>Movies</h1>  
                <div className="input-group search-bar">                    
                    <input type="text" className="form-control " placeholder="Search..." 
                        onChange={
                            (e) => {
                                setSearchVal(e.target.value);
                            }
                        }
                    />
                    <button className="btn btn-success" type="button" id="button-addon2" onClick={goToAddMovie}>
                        <i className="fa fa-plus"></i>
                        <span className="ms-2">Add</span>
                    </button>
                </div>   
            </div>    
            <table className="table table-hover ">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Rating</th>
                        <th>Runtime</th>
                        <th>Released</th>
                        <th>Format</th>
                        <th>Status</th>
                        <th>Holds</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {movies && movies.map((item)=>(
                        <tr key={item._id}>
                            <td style={{width:"10%"}}><img src={item.image} className="img-thumbnail" alt="Image Not Found"></img></td>
                            <td className="align-middle">{item.title}</td>
                            <td className="align-middle">{item.rating}</td>
                            <td className="align-middle">{item.runtime}</td>
                            <td className="align-middle">{item.releaseDate}</td>
                            <td className="align-middle">{item.format}</td>
                            <td className="align-middle">{getStatus(item)}</td>
                            <td className="align-middle"> {item.holds ? item.holds.length : 0}</td>
                            <td className="align-middle actionButtons">
                                <a href={"/movies/" + item._id} className="btn btn-sm btn-primary" data-bs-toggle="tooltip" 
                                    data-bs-placement="bottom" title="Edit">
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
                    <div className="text-center fw-bold fs-4">Are you sure you want to delete?</div>
                    <div className = "book-wrapper">
                        <img src={deletedImage}></img>
                        <div className="bookModal">
                            <div>
                                <p>Title: <span>{deletedTitle}</span></p>
                            </div>
                            <div>
                                <p>Format: <span>{deletedFormat}</span></p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteMovie} className="fw-bold btn-danger mx-auto author-button">
                    Delete Movie
                    </Button>
                    <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>    
        </div>  
    );
};
export default MoviesList;

