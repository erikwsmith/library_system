import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { v4 as uuidv4} from 'uuid';
const {Button, Modal, Collapse} = require('react-bootstrap');

const EditMusic = () => {

    const {id} = useParams();
    const[error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [music, setMusic] = useState([]);
    const [title, setTitle] = useState('');    
    const [image, setImage] = useState('');   
    const [callNumber, setCallNumber] = useState(''); 
    const [format, setFormat] = useState(''); 
    const [runtime, setRuntime] = useState(''); 
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState(''); 
    const [tracks, setTracks] = useState([]); 
    const [trackCount, setTrackCount] = useState(0);
    const [status, setStatus] = useState('');
    const [holds, setHolds] = useState([]);
    const [holdCount, setHoldCount] = useState(0);   
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
    const trackListRef = useRef();
    const [collapse, setCollapse] = useState(false);
    const toggleRef = useRef();
    const [musicCount, setMusicCount] = useState(0);
    
    const getStatus = (item) =>{
        if(item.checkedOut === false && item.holds && item.holds.length > 0){
            return 'On Hold'
        }else if(item.checkedOut === true){
            return 'In Use'
        }else{
            return 'Available'
        };
    };
    const handleClose = () => {setShow(false); clearArtistForm()};
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
        const music = {title, image, format, runtime, genre, releaseDate, artists, callNumber, tracks};
        //const response = await fetch('http://localhost:4000/music/' + id, {
        const response = await fetch('https://library-system-rydv.onrender.com/music/' + id, {
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
        if(group_name === '' && (last_name === '' || first_name === '')){
            checkValidity(groupNameRef);
            checkValidity(lastNameRef); 
            checkValidity(firstNameRef);
            return;
        }             
        const artist = {group_name, last_name, full_name, first_name, middle_name, biography};        
            //const response = await fetch('http://localhost:4000/artists/add', {
            const response = await fetch('https://library-system-rydv.onrender.com/artists/add', {
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
            }                             
            handleClose(); 
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
            //const musicQuery = await fetch('http://localhost:4000/music/' + id);
            const musicQuery = await fetch('https://library-system-rydv.onrender.com/music/' + id);
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
                setCallNumber(music.callNumber);     
                setArtists(music.artists);      
                setCreatedAt(music.createdAt);
                setTracks(music.tracks);
                setMusicCount(music.length);
            };            
        };       
        const fetchArtists = async() => {
            //const response = await fetch('http://localhost:4000/artists');
            const response = await fetch('https://library-system-rydv.onrender.com/artists');
            const json = await response.json();
            if(response.ok){
                setArtistsList(json);
            }
        };          
        const mapArtists = async() => {            
            let selectedArtistsArr = [];
            for (let i = 0; i < artistsList.length; i++){
                artistsList.map((obj)=> {
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
    }, [createdAt, full_name, musicCount]);  

    const toggleCollapse = (element) => {   
        if(collapse){
            element.current.innerHTML = '<span class="material-symbols-outlined">expand_less</span>'
        }else{
            element.current.innerHTML = '<span class="material-symbols-outlined">expand_more</span>'        
        };
    };
    const addTrack = async() => { 
        const newTrackObj = {id: uuidv4(), title: ''};
        tracks.push(newTrackObj);
        setTrackCount(tracks.length);
    }
    const deleteTrack =(e) =>{
        e.preventDefault();              
        let clickedIndex=parseInt((e.target.parentElement).firstChild.innerText) - 1;         
        console.log(tracks[clickedIndex]);
        let newArr = tracks;
        newArr.splice(newArr.indexOf(tracks[clickedIndex]),1);
        setTracks(newArr);
        setTrackCount(newArr.length);
        //console.log(tracks);         
    }
    const updateTracks =(id, input) => {
        for(let i = 0; i < tracks.length; i++){
            if(tracks[i].id === id){
                tracks[i].title = input;
            };
        };
        setTracks(tracks);        
    }
    return(
        <div className="container">
            <div className = "music-wrapper">                
                <img src={image}></img>
                <h2>{title}</h2>
            </div>
            <form>
                <div className="form-group row">
                    <div className="col-xs-12 col-lg-6 mt-3">
                    <label className="fw-bold">Title</label>
                        <input className="form-control" required type="text" value={title} ref={titleRef}
                            onChange={e => {setTitle(e.target.value)}}/>
                    </div>
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label className="fw-bold">Cover Image URL</label>
                        <input className="form-control" type="text" defaultValue={image} onChange={e => setImage(e.target.value)}/>                    
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label className="fw-bold">Call Number</label>
                        <input className="form-control" type="text" defaultValue={callNumber}
                            onChange={e => setCallNumber(e.target.value)}/>
                    </div>       
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label className="fw-bold">Format</label>
                        <select className="form-select" value={format} onChange={e => setFormat(e.target.value)}>
                            <option></option>
                            <option>Audio CD</option>                        
                        </select>
                    </div>  
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label className="fw-bold">Genre</label>
                        <select className="form-select" value={genre} onChange={e => setGenre(e.target.value)}>
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
                        <label className="fw-bold">Runtime (minutes)</label>
                        <input className="form-control" type="number" defaultValue={runtime} 
                            onChange={e => setRuntime(e.target.value)}/>
                    </div> 
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label className="fw-bold">Released</label>
                        <input className="form-control" type="number" defaultValue={releaseDate} 
                            onChange={e => setReleaseDate(e.target.value)}/>
                    </div>   
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label className="fw-bold">Status</label>
                        <input className="form-control" type="text" readOnly disabled defaultValue={status}/>
                    </div>  
                    <div className="col-xs-12 col-lg-6 mt-3">
                        <label className="fw-bold">Holds</label>
                        <div className="input-group">
                            <span className="input-group-text">{holdCount}</span>
                            <select className="form-select" value={holds} readOnly>
                                {holds && holds.map((item) => (                            
                                        <option>{item}</option>
                                    )
                                )}                      
                        </select>
                        </div>
                    </div>                     
                    <div className="author-select col-12 mt-3">                       
                        <label className="fw-bold">Artist</label>
                        <div className="input-group artistSelect">
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
                    <div className="col-xs-12 col-lg-12 mt-3 ">
                        <div className="input-group col-xs-12 col-lg-3 mt-3 toggleInput">
                            <label className="fw-bold mt-2">Tracks</label> 
                            <div className="input-group mx-2">  
                                <input type="text" id="trackCountInput" className="form-control" readOnly value={trackCount}/> 
                                <Button className="btn btn-light border addTrack" onClick={addTrack}>Add</Button>                 
                                <button className="btn btn-light btn-sm input-group-text border toggleButton" type="button" ref={toggleRef} 
                                    onClick={()=>{setCollapse(!collapse); toggleCollapse(toggleRef)}}
                                    aria-controls="tracksDiv" aria-expanded={collapse}>                            
                                    <span className="material-symbols-outlined">expand_less</span>                            
                                </button> 
                            </div>  
                        </div>
                        <div className="col-xs-12 col-lg-12 mt-3">                        
                            <Collapse in={!collapse}>
                                <div id="tracksDiv" ref={trackListRef} className="col-xs-12 col-lg-12 mt-3">
                                    {tracks && tracks.map((item, key)=>(                                                                      
                                        <div key={item.id}className="input-group" >
                                            <span className="input-group-text trackCount">{key + 1}</span>
                                            <input className="form-control" type="text" defaultValue={item.title}
                                                onChange={(e)=>{updateTracks(item.id, e.target.value)}}/>
                                            <Button className="btn btn-sm btn-danger border" data-bs-toggle="tooltip" 
                                                data-bs-placement="bottom" title="Delete" onClick={deleteTrack}>
                                                    <i className="fa fa-trash-o trashIcon"></i>
                                            </Button>
                                        </div>                                        
                                    ))}                                        
                                </div>                                                   
                            </Collapse>                                                    
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
                        <label className="col-sm-3 col-form-label">Group Name</label>
                        <div className="col-sm-9">
                        <input type="text" className="form-control needs-validation" 
                            ref={groupNameRef} value={group_name} 
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
                        <label htmlFor="biography" className="col-sm-3 col-form-label">Biography</label>
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