import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
const {Button, Modal} = require('react-bootstrap');

const EditMusic = () => {

    const {id} = useParams();
    const[error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [music, setMusic] = useState([]);
    const [title, setTitle] = useState('');    
    const [image, setImage] = useState('');   
    const [format, setFormat] = useState(''); 
    const [runtime, setRuntime] = useState(''); 
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState(''); 
    const [tracks, setTracks] = useState([]); 
    const [trackCount, setTrackCount] = useState(null);
    const [status, setStatus] = useState('');
    const [holds, setHolds] = useState([]);
    const [holdCount, setHoldCount] = useState(null);   
    const titleRef = useRef();
    const [artists, setArtists] = useState('');
    const [artistsList, setArtistsList] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [first_name, setFirstName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [last_name, setLastName] = useState('');
    const [group_name, setGroupName] = useState('');
    const [full_name, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const lastNameRef = useRef();
    const firstNameRef = useRef();
    const groupNameRef = useRef();
    
    const getStatus = (item) =>{
        if(item.checkedOut === false && item.holds && item.holds.length > 0){
            return 'On Hold'
        }else if(item.checkedOut === true){
            return 'In Use'
        }else{
            return 'Available'
        };
    };
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const handleUpdateShow = () => setShowUpdateModal(true);
    const handleUpdateClose = () => setShowUpdateModal(false);
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
    const handleUpdate = () =>{
        if(!title == ''){
            handleUpdateShow();
        }else{
            checkValidity(titleRef);
        };
    };
    const updateMusic = async() =>{
        const music = {title, image, format, runtime, genre, releaseDate, artists};
        const response = await fetch('http://localhost:4000/music/' + id, {
            method: 'PATCH',
            body: JSON.stringify(music),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){
            window.location = '/music';
        };
    };
    const submitArtist = async(e) => {
        e.preventDefault();  
        checkValidity(groupNameRef);
        checkValidity(lastNameRef);       
        const artist = {group_name, last_name, full_name, biography};
        if(group_name !='' || last_name !=''){
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
                clearArtistForm();
                console.log('New Artist Added!', json);     
                handleClose();         
            }
        }        
    }   
    const clearArtistForm = ()=> {
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setFullName('');
        setGroupName('');
        setBiography('');  
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
            setFullName(event.target.value);
        };
    };
    // fetch record from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{          
            //get all movies
            const musicQuery = await fetch('http://localhost:4000/music/' + id);
            let musicJson = await musicQuery.json();
            if(musicQuery.ok) {                 
                setMusic(musicJson);
                setTitle(music.title);                
                setStatus(getStatus(music));  
                setHolds(music.holds);
                music.holds && music.holds.length > 0 ? setHoldCount(music.holds.length): setHoldCount(0);                              
                setImage(music.image);    
                music.tracks && music.tracks.length > 0 ? setTrackCount(music.tracks.length): setTrackCount(0);
                setReleaseDate(music.releaseDate);
                setGenre(music.genre);
                setRuntime(music.runtime);     
                setFormat(music.format);        
                setArtists(music.artists);      
                setCreatedAt(music.createdAt);               
            };            
        };
        const fetchArtists = async() => {
            const response = await fetch('http://localhost:4000/artists');
            const json = await response.json();
            if(response.ok){
                setArtistsList(json);
            }
        };
        const mapArtists = async() => {
            let selectedArtistsArr = [];
            for (let i = 0; i < artistsList.length; i++){
                artistsList.map((obj)=>{
                    if(obj._id === music.artists[i]){
                        selectedArtistsArr.push(obj);
                    }
                })
            }
            setSelectedArtists(selectedArtistsArr);
        };
         fetchData();
         fetchArtists();
         mapArtists();           
    }, [createdAt, genre, full_name]);    

    return(
        <div className="container">
            <div className = "music-wrapper">                
                <img src={image}></img>
                <h2>{title}</h2>
            </div>
            <form>
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-6 mt-3">
                    <label htmlFor="ex1" className="fw-bold">Title</label>
                        <input className="form-control" required id="ex1" type="text" value={title} ref={titleRef}
                            onChange={e => {setTitle(e.target.value)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label htmlFor="ex2" className="fw-bold">Cover Image URL</label>
                        <input className="form-control" id="ex2" type="text" defaultValue={image} onChange={e => setImage(e.target.value)}/>                    
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex6" className="fw-bold">Format</label>
                        <select className="form-select" id="ex6" value={format} onChange={e => setFormat(e.target.value)}>
                            <option></option>
                            <option>Audio CD</option>                        
                        </select>
                    </div>  
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex6" className="fw-bold">Genre</label>
                        <select className="form-select" id="ex6" value={genre} onChange={e => setGenre(e.target.value)}>
                            <option></option>  
                            <option>Classical</option>
                            <option>Country</option>
                            <option>Hip-Hop</option>
                            <option>Pop</option>
                            <option>Rhythm & Blues</option>
                            <option>Rock</option>
                        </select>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex5" className="fw-bold">Tracks</label>
                        <input className="form-control" id="ex5" type="number" defaultValue={trackCount} 
                            onChange={e => setTrackCount(e.target.value)}/>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex5" className="fw-bold">Runtime</label>
                        <input className="form-control" id="ex5" type="number" defaultValue={runtime} 
                            onChange={e => setRuntime(e.target.value)}/>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex5" className="fw-bold">Released</label>
                        <input className="form-control" id="ex5" type="number" defaultValue={releaseDate} 
                            onChange={e => setReleaseDate(e.target.value)}/>
                    </div>   
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="bookStatus" className="fw-bold">Status</label>
                        <input className="form-control" id="bookStatus" type="text" readOnly defaultValue={status}/>
                    </div>  
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label htmlFor="ex7" className="fw-bold">Holds</label>
                        <div className="input-group">
                            <span className="input-group-text">{holdCount}</span>
                            <select className="form-select" id="ex7" value={holds} readOnly>
                        {holds && holds.map((item) => (                            
                                <option>{item}</option>
                            )
                        )}                      
                        </select>
                        </div>
                    </div> 
                    <div className="author-select col-12 mt-3">                       
                    <label htmlFor="ex4" className="fw-bold">Artist</label>
                    <div className="input-group">
                        <Multiselect                                                 
                        onKeyPressFn={function noRefCheck() {}}       
                        onRemove={(event)=>{
                            setArtists(event);
                        }}   
                        onSelect={(list, item)=>{
                            setArtists(list);
                        }}                                      
                        onSearch={function noRefCheck() {}}     
                        options={
                            artistsList
                        }
                        displayValue='full_name'
                        avoidHighlightFirstOption={true}
                        closeIcon='cancel'
                        placeholder='Select an Artist'     
                        selectedValues={selectedArtists}                       
                        >                                       
                        </Multiselect>
                        <button className="btn btn-success text-white btn-outline-default" type="button" onClick={handleShow}>
                            <i className="fa fa-plus"></i>
                        </button>    
                    </div> 
                </div>                                      
                </div>
                <br/>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button className="btn btn-default add-book-button fs-6" onClick={handleUpdate}>Update</Button>
                    <a href="/music"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75}}>
                <Modal.Body>
                    <div className = "fw-bold text-center fs-5">Add a New Artist</div>
                    <div className="mb-3 mt-3 row">
                        <label htmlFor="groupName" className="col-sm-3 col-form-label">Group Name</label>
                        <div className="col-sm-9">
                        <input type="text" className="form-control needs-validation" id="groupName"
                            ref={groupNameRef} value={group_name} required
                            onChange={(e)=>{setGroupName(e.target.value); updateFullName(e, "group_name");
                            checkValidity(groupNameRef)}}
                            />
                        </div>                            
                    </div>
                    <div className="mb-3 mt-3 row">
                        <label htmlFor="lastName" className="col-sm-3 col-form-label">Last Name</label>
                        <div className="col-sm-9">
                        <input type="text" className="form-control needs-validation" id="lastName"
                            ref={lastNameRef} value={last_name} 
                            onChange={(e)=>{setLastName(e.target.value); updateFullName(e, "last_name");
                                checkValidity(lastNameRef)}}
                            />
                        </div>                            
                    </div>
                    <div className="mb-3 mt-3 row">
                        <label htmlFor="firstName" className="col-sm-3 col-form-label">First Name</label>
                        <div className="col-sm-9">
                        <input type="text" className="form-control" id="firstName" value={first_name} 
                            ref={firstNameRef} 
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
                            required onChange={(e)=>setFullName(e.target.value)}/>
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
                    <Button onClick={submitArtist} className="fw-bold btn-info mx-auto author-button">Add Artist</Button>
                    <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showUpdateModal} onHide={handleClose} backdrop='static' keyboard='false' style={{marginTop: 75}}>
                <Modal.Body>
                    <div className="fw-bold fs-4 text-center">Save all changes?</div>                
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={updateMusic} className=" btn-success mx-auto author-button">Save</Button>
                        <Button onClick={handleUpdateClose} className=" btn-secondary mx-auto author-button">Cancel</Button>
                </Modal.Footer>
            </Modal>                
        </div>
    )
}

export default EditMusic;