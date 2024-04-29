import { useEffect, useState} from 'react'
const {Button, Modal} = require('react-bootstrap');

const MusicList = () => {
    const [searchVal, setSearchVal] = useState('');
    const [music, setMusic] = useState([]);
    const [artists, setArtists] = useState([]);
    const [show, setShow] = useState(false);
    const [deletedImage, setDeletedImage] = useState('');
    const [deletedTitle, setDeletedTitle] = useState('');
    const [deletedCallNumber, setDeletedCallNumber] = useState('');
    const [deletedID, setDeletedID] = useState('');
    const [deleted, setDeleted] = useState('');

    const getCount = (obj) => {
        return obj.length;
    }
    const goToAddMusic = () => {window.location='/music/add'};
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const deleteMusic = async() => {
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
        let callNumber = parentEl.getElementsByTagName("td")[4].innerHTML;
        let musicID = parentEl.getElementsByTagName("td")[10].firstChild.getAttribute("href");
        setDeletedImage(image);
        setDeletedTitle(title);
        setDeletedCallNumber(callNumber);
        setDeletedID(musicID);
    };

    const getArtist= (artistID)=> {
        for (let i = 0; i < artists.length; i++) {
            if (artists[i]._id === artistID){
                return artists[i].full_name;
            }            
        }
    }
    // fetch records from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{
            //get all artists
            const artistQuery = await fetch('http://localhost:4000/artists');
            const artistJson = await artistQuery.json();
            if(artistQuery.ok) {    
                setArtists(artistJson);    
            }; 
            //get all music records         
            const musicQuery = await fetch('http://localhost:4000/music');
            let musicJson = await musicQuery.json();
            if(musicQuery.ok) {
                const filterResults = musicJson.filter((item)=> {
                    let runtime='';
                    let holdNum = '';
                    let tracks = '';
                    let releaseDate = '';
                    let artistString = '';
                    let status = '';
                    status = getStatus(item);                   

                    if(item.runtime){runtime = item.runtime.toString();}
                    if(item.tracks){tracks = item.tracks.length.toString();}
                    if(item.releaseDate){releaseDate = item.releaseDate.toString();}
                    if(item.holds){holdNum = item.holds.toString();}
                    let artistArray = item.artists.map((item)=>{
                        artistString += getArtist(item) + ' ';
                    });                                                       
                    if(item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.format.toLowerCase().includes(searchVal.toLowerCase()) ||
                        artistString.toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.genre.toLowerCase().includes(searchVal.toLowerCase()) ||
                        tracks.toLowerCase().includes(searchVal.toLowerCase()) ||
                        runtime.toLowerCase().includes(searchVal.toLowerCase()) ||
                        releaseDate.toLowerCase().includes(searchVal.toLowerCase()) ||
                        status.toLowerCase().includes(searchVal.toLowerCase()) || 
                        item.callNumber && item.callNumber.toLowerCase().includes(searchVal.toLowerCase())
                    ){
                        return item;
                    }
                });           
                setMusic(filterResults);
            };            
        };
        fetchData();
    }, [searchVal, deleted] );
    const getStatus = (item) =>{
        if(!item.checkedOut && item.holds.length > 0){
            return 'On Hold'
        }else if(item.checkedOut && item.checkedOut === true){
            return 'In Use'
        }else{
            return 'Available'
        };
    };
    return (
        <div className="container">
        <div id="pageTitle">
            <h1>Music</h1>  
            <div className="input-group search-bar">                    
                <input type="text" className="form-control " placeholder="Search..." 
                    onChange={
                        (e) => {                           
                            setSearchVal(e.target.value);
                        }
                    }
                />
                <button className="btn btn-success" type="button" id="button-addon2" onClick={goToAddMusic}>
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
                        <th>Status</th>
                        <th>Artist</th>
                        <th>Call Number</th>
                        <th>Format</th>                        
                        <th>Genre</th>
                        <th>Runtime</th>
                        <th>Released</th>
                        <th>Holds</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {music && music.map((item)=>(
                        <tr key={item._id}>
                            <td style={{width:"13%"}}><img src={item.image} className="img-thumbnail" alt="Image Not Found"></img></td>
                            <td className="align-middle">{item.title}</td>
                            <td className="align-middle">{getStatus(item)}</td>
                            <td className="align-middle">
                                {item.artists && item.artists.map((record)=>{
                                    return <p>{getArtist(record)}</p>
                                })} 
                            </td>
                            <td className="align-middle">{item.callNumber}</td>
                            <td className="align-middle">{item.format}</td>
                            <td className="align-middle">{item.genre}</td>
                            <td className="align-middle">{item.runtime}</td>
                            <td className="align-middle">{item.releaseDate}</td>
                            <td className="align-middle"> {item.holds ? item.holds.length : 0}</td>
                            <td className="align-middle actionButtons">
                                <a href={"/music/" + item._id} className="btn btn-sm btn-primary" data-bs-toggle="tooltip" 
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
                    <div className = "music-wrapper">
                        <img className = "musicImg" src={deletedImage}></img>
                        <div className="musicModal">
                            <div>
                                <p>Title: <span>{deletedTitle}</span></p>
                            </div>
                            <div>
                                <p>Call Number: <span>{deletedCallNumber}</span></p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteMusic} className="fw-bold btn-danger mx-auto author-button">
                    Delete Music
                    </Button>
                    <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>              
    </div> 
    );
};
export default MusicList;