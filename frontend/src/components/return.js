import {React, useState, useEffect, useRef} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const {Button, Modal} = require('react-bootstrap');

const Return = () =>{ 
    
    const [returnDate, setReturnDate] = useState('');
    const [books, setBooks] = useState([]);
    const [music, setMusic] = useState([]);
    const [movies, setMovies] = useState([]);    
    const [circulation, setCirculation] = useState([]);
    
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState([]);
    const [showItemsError, setShowItemsError] = useState(false);
    const [showSuccessful, setShowSuccessful] = useState(false);
    const [error, setError] = useState('');

    const handleCloseItemsError = () => {setShowItemsError(false);}
    const handleShowItemsError = () => setShowItemsError(true);
    const handleCloseSuccessful = () => {setShowSuccessful(false); window.location='/circulation'};
    const handleShowSuccessful = () => setShowSuccessful(true);

    const getReturnDate = (date) => {
        let dateString = '';
        dateString = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return dateString;
    };
    const handleSubmit = async(e)=>{
        e.preventDefault();   
        const bookCount = selectedBooks.length;
        const movieCount = selectedMovies.length;
        const musicCount = selectedMusic.length;
        const totalSelected = bookCount + movieCount + musicCount;        
        const combinedArray = selectedBooks.concat(selectedMovies, selectedMusic);
        const return_date = returnDate;

        if(!totalSelected){           
            handleShowItemsError();
            return;
        }            
        combinedArray.forEach(async(i)=>{
            circulation.forEach(async(rec)=>{
                if (rec.itemID === i._id && (!rec.returnDate || rec.returnDate === '' || rec.returnDate === null)){
            //update circulation record's return date            
            const itemRecord = {returnDate: returnDate};
            const itemResponse = await fetch('http://localhost:4000/circulation/' + rec._id, {
                method: 'PATCH',
                body: JSON.stringify(itemRecord),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const itemJson = await itemResponse.json();
            if(!itemResponse.ok){
                setError(itemJson.error);
                return;
            }  
                }
            }) // end inner loop

            const itemID = i._id;            
            const itemType = i.type;
            let itemCollection = '';
            if(itemType === 'Book'){itemCollection = 'books/'};
            if(itemType === 'Movie'){itemCollection = 'movies/'};
            if(itemType === 'Music'){itemCollection = 'music/'};    

            //update item's checkout status            
            const itemRecord = {checkedOut: false};
            const itemUpdate = await fetch('http://localhost:4000/' + itemCollection + itemID, {
                method: 'PATCH',
                body: JSON.stringify(itemRecord),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const itemJson = await itemUpdate.json();
            if(!itemUpdate.ok){
                setError(itemJson.error);
                return;
            }
        }) //end outer loop 
        handleShowSuccessful();    
    }    

    const formatDate = (date) => {        
        let dateString = '';
        dateString = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return dateString;
    }    

    const findAvailableItems =(item)=>{
        if(item.checkedOut && (!returnDate || returnDate === '' || returnDate === undefined)){
            return item;
        };
    }

    useEffect(()=>{              
        const fetchBooks = async() => {
            const response = await fetch('http://localhost:4000/books');
            const json = await response.json();            
            if(response.ok){
                const availableBooks = json.filter(findAvailableItems);
                setBooks(availableBooks);                                   
            }
        };
        const fetchMovies = async() => {
            const response = await fetch('http://localhost:4000/movies');
            const json = await response.json();
            if(response.ok){
                const availableMovies = json.filter(findAvailableItems);
                setMovies(availableMovies);                    
            }
        };
        const fetchMusic = async() => {
            const response = await fetch('http://localhost:4000/music');
            const json = await response.json();
            if(response.ok){
                const availableMusic = json.filter(findAvailableItems);
                setMusic(availableMusic);                    
            }
        };
        const fetchCirculation = async() => {
            const response = await fetch('http://localhost:4000/circulation');
            const json = await response.json();
            if(response.ok){                
                setCirculation(json);                    
            }
        };
        fetchBooks();
        fetchMovies();
        fetchMusic();
        fetchCirculation();
        let today = new Date();    
        setReturnDate((getReturnDate(today)).toString());   
    }, []);

    return(
        <div className="container">
            <h1>Return Items</h1>
            <form>
                <div className="form-group row">              
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex3" className="fw-bold">Return Date</label>
                        <input className="form-control" id="ex3" type="date" readOnly defaultValue={returnDate}/>
                    </div>
                    <div className="col-xs-12 col-lg-12 mt-3 ">                        
                        <label htmlFor="ex6" className="fw-bold">Books</label>
                        <Multiselect
                            onKeyPressFn={function noRefCheck() {}}       
                            onRemove={(event)=>{
                                setSelectedBooks(event);                               
                            }}   
                            onSelect={(list, item)=>{
                                setSelectedBooks(list);
                            }}                                      
                            onSearch={function noRefCheck() {}}     
                            options={
                                books
                            }
                            displayValue= 'title'
                            avoidHighlightFirstOption={true}
                            closeIcon='cancel'
                            placeholder='Select...'                         
                        />                        
                    </div>
                    <div className="col-xs-12 col-lg-12 mt-3 ">                        
                        <label htmlFor="ex6" className="fw-bold">Movies</label>
                        <Multiselect
                            onKeyPressFn={function noRefCheck() {}}       
                            onRemove={(event)=>{
                                setSelectedMovies(event);                               
                            }}   
                            onSelect={(list, item)=>{
                                setSelectedMovies(list);
                            }}                                      
                            onSearch={function noRefCheck() {}}     
                            options={
                                movies
                            }
                            displayValue= 'title'
                            avoidHighlightFirstOption={true}
                            closeIcon='cancel'
                            placeholder='Select...'                         
                        />                        
                    </div>
                    <div className="col-xs-12 col-lg-12 mt-3 ">                        
                        <label htmlFor="ex6" className="fw-bold">Music</label>
                        <Multiselect
                            onKeyPressFn={function noRefCheck() {}}       
                            onRemove={(event)=>{
                                setSelectedMusic(event);                               
                            }}   
                            onSelect={(list, item)=>{
                                setSelectedMusic(list);
                            }}                                      
                            onSearch={function noRefCheck() {}}     
                            options={
                                music
                            }
                            displayValue= 'title'
                            avoidHighlightFirstOption={true}
                            closeIcon='cancel'
                            placeholder='Select...'                         
                        />                        
                    </div>
                </div>
                <br/><br/>
                <div className="col-12 mt-4 mx-auto text-center">
                    <Button className="btn btn-default add-book-button fs-6" onClick={handleSubmit}>Submit</Button>
                    <a href="/"><Button className="btn btn-danger add-book-button fs-6">Cancel</Button></a>
                </div>
            </form>
            <Modal show={showItemsError} onHide={handleCloseItemsError} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>Please select at least one item.</h4>                                                                           
                        </div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseItemsError} className=" btn-warning mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSuccessful} onHide={handleCloseSuccessful} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>Items successfully returned!</h4>
                        </div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseSuccessful} className=" btn-success mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>        
    )
};

export default Return;