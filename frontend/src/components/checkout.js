import {React, useState, useEffect, useRef} from 'react';
import Multiselect from 'multiselect-react-dropdown';
const {Button, Modal} = require('react-bootstrap');

const Checkout = () =>{ 

    const [checkoutDate, setCheckoutDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [books, setBooks] = useState([]);
    const [music, setMusic] = useState([]);
    const [movies, setMovies] = useState([]);
    const [circulation, setCirculation] = useState([]);
    const [userAccount, setUserAccount] = useState('');
    const [userName, setUserName] = useState('');
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState([]);
    const [allowableItems, setAllowableItems] = useState(0);
    const [error, setError] = useState('');
    const [showUserError, setShowUserError] = useState(false);
    const [showItemsError, setShowItemsError] = useState(false);
    const [showOverLimitError, setShowOverLimitError] = useState(false);
    const [showItemLimitError, setShowItemLimitError] = useState(false);
    const [showAllowableItemsError, setShowAllowableItemsError] = useState(false);
    const [showSuccessful, setShowSuccessful] = useState(false);
    const [holdsMessage, setHoldsMessage] = useState('');
    const [showHolds, setShowHolds] = useState(false);
    let [updatedHolds, setUpdatedHolds] = useState([]);

    const handleCloseUserError = () => {setShowUserError(false);}
    const handleShowUserError = () => setShowUserError(true);
    const handleCloseItemsError = () => {setShowItemsError(false);}
    const handleShowItemsError = () => setShowItemsError(true);
    const handleCloseOverLimitError = () => {setShowOverLimitError(false);}
    const handleShowOverLimitError = () => setShowOverLimitError(true);
    const handleCloseAllowableItemsError = () => {setShowAllowableItemsError(false);}
    const handleShowAllowableItemsError = () => setShowAllowableItemsError(true);
    const handleCloseItemLimitError = () => {setShowItemLimitError(false);}
    const handleShowItemLimitError = () => setShowItemLimitError(true);
    const handleCloseSuccessful = () => {setShowSuccessful(false); window.location='/circulation'};
    const handleShowSuccessful = () => setShowSuccessful(true);
    const handleCloseHolds = () => setShowHolds(false);
    const handleShowHolds = () => setShowHolds(true);

    const handleSubmit = async(e) => {
        e.preventDefault();   
        const bookCount = selectedBooks.length;
        const movieCount = selectedMovies.length;
        const musicCount = selectedMusic.length;
        const bookHolds = [];
        const movieHolds = [];
        const musicHolds = [];
        const totalSelected = bookCount + movieCount + musicCount;
        const alreadyBorrowed = getUserCheckedItems(userAccount, circulation).length;
        const combinedArray = selectedBooks.concat(selectedMovies, selectedMusic);

        if(!userAccount){            
            handleShowUserError();
            return;
        }
        if(alreadyBorrowed > 4){
            handleShowOverLimitError();
            return;
        }        
        if(!totalSelected){           
            handleShowItemsError();
            return;
        }    
        if(alreadyBorrowed === 0 && totalSelected > 5){
            handleShowItemLimitError();
            return;
        };
        if(alreadyBorrowed + totalSelected > 5){
            setAllowableItems(alreadyBorrowed);
            handleShowAllowableItemsError();
            return;
        }          
        //check for holds by other Users
        for(let i = 0; i < totalSelected; i++){            
            if (combinedArray[i].holds.length > 0 && combinedArray[i].holds[0] !== userAccount){
                if(combinedArray[i].type === 'Book'){bookHolds.push(combinedArray[i])};
                if(combinedArray[i].type === 'Movie'){movieHolds.push(combinedArray[i])};
                if(combinedArray[i].type === 'Music'){musicHolds.push(combinedArray[i])};
            }
        }
        if (bookHolds.length > 0 || movieHolds.length > 0 || musicHolds.length > 0) {
            let holdsMsg = '';
            if(bookHolds.length > 0){
                holdsMsg += '<div class="bookHolds"><h5>Books: </h5> <ul>';
                for(let i = 0; i < bookHolds.length; i++){
                    holdsMsg += '<li class="holdItems">' + bookHolds[i].title + '</li>';
                };
                holdsMsg += '</ul></div>'
            }
            if(movieHolds.length > 0){
                holdsMsg += '<div class="movieHolds"><h5>Movies: </h5> <ul>';
                for(let i = 0; i < movieHolds.length; i++){
                    holdsMsg += '<li class="holdItems">' + movieHolds[i].title + '</li>';
                };
                holdsMsg += '</ul></div>'
            }
            if(musicHolds.length > 0){
                holdsMsg += '<div class="musicHolds"><h5>Music: </h5> <ul>';
                for(let i = 0; i < musicHolds.length; i++){
                    holdsMsg += '<li class="holdItems">' + musicHolds[i].title + '</li>';
                };
                holdsMsg += '</ul></div>'
            }
            setHoldsMessage(holdsMsg);
            handleShowHolds();
            return;
        }

        for(let i = 0; i < totalSelected; i++){            
            const itemType = combinedArray[i].type;
            const itemID = combinedArray[i]._id;
            const itemTitle = combinedArray[i].title;
            let itemCollection = '';
            if(itemType === 'Book'){itemCollection = 'books/'};
            if(itemType === 'Movie'){itemCollection = 'movies/'};
            if(itemType === 'Music'){itemCollection = 'music/'};            
            if(combinedArray[i].holds && combinedArray[i].holds[0] === userAccount){
                setUpdatedHolds((combinedArray[i].holds).shift())
            }else{setUpdatedHolds = combinedArray[i].holds};
            
            //add circulation record
            const circulationRecord = {userAccount, checkoutDate, dueDate, itemType, itemID, itemTitle};       
            const circulationResponse = await fetch('http://localhost:4000/circulation/add', {
                method: 'POST',
                body: JSON.stringify(circulationRecord),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await circulationResponse.json();
            if(!circulationResponse.ok){
                setError(json.error);
                return;
            }  
            //update item's checkout and holds status            
            const itemRecord = {holds: updatedHolds, checkedOut: true};
            const itemResponse = await fetch('http://localhost:4000/' + itemCollection + itemID, {
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
        }  //end loop 
        handleShowSuccessful();
    }
    const getCheckoutDate = (date) => {
        let dateString = '';
        dateString = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return dateString;
    }
    const getDueDate = (date) => {
        let futureDate = new Date(Date.now() + 12096e5);
        let dateString = '';
        dateString = futureDate.getFullYear() + '-' + ('0' + (1 + futureDate.getMonth())).slice(-2) + '-' + ('0' + futureDate.getDate()).slice(-2);
        return dateString;
    }   
    const getUserName = (userID) => {
        for(let i = 0; i < usersList.length; i++){
            if(usersList[i]._id === userID){                
                return usersList[i].full_name;
            }
        }               
    };
    const getUserAccount = (userID) => {
        for(let i = 0; i < usersList.length; i++){
            if(usersList[i]._id === userID){                
                return usersList[i].user_id;
            }
        }               
    };
    const getUserCheckedItems = (userID, arr) =>{
        const getItems = (item)=>{
            if(userID === item.userAccount && (!item.returnDate || item.returnDate === '' || item.returnDate === 'undefined')){
                return item;
            }
        };
        const result = arr.filter(getItems);
        return result;
    }
    const findAvailableItems =(item)=>{
        if(!item.checkedOut){
            return item;
        };
    }
    useEffect(()=>{
        const fetchUsers = async() => {
            const response = await fetch('http://localhost:4000/users');
            const json = await response.json();
            if(response.ok){
                setUsersList(json);
                let today = new Date();    
                setCheckoutDate(getCheckoutDate(today));     
                setDueDate(getDueDate(today));     
            }
        };        
        const fetchBooks = async() => {
            const response = await fetch('http://localhost:4000/books');
            const json = await response.json();            
            if(response.ok){
                const availableBooks = json.filter(findAvailableItems);
                availableBooks.forEach((i)=>{i.displayName = i.title + '  (' + i.callNumber + ')'});
                setBooks(availableBooks);                                   
            }
        };
        const fetchMovies = async() => {
            const response = await fetch('http://localhost:4000/movies');
            const json = await response.json();
            if(response.ok){
                const availableMovies = json.filter(findAvailableItems);
                availableMovies.forEach((i)=>{i.displayName = i.title + '  (' + i.callNumber + ')'});
                setMovies(availableMovies);                    
            }
        };
        const fetchMusic = async() => {
            const response = await fetch('http://localhost:4000/music');
            const json = await response.json();
            if(response.ok){
                const availableMusic = json.filter(findAvailableItems);
                availableMusic.forEach((i)=>{i.displayName = i.title + '  (' + i.callNumber + ')'});
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
        fetchUsers();
        fetchBooks();
        fetchMovies();
        fetchMusic();
        fetchCirculation();
    }, [userAccount]);

    return(
        <div className="container">
            <h1>Checkout Items</h1>
            <form>
                <div className="form-group row">                    
                    <div className="col-xs-12 col-lg-3 mt-3">
                    <label htmlFor="ex6" className="fw-bold">User Account</label>
                    <select className="form-select" id="ex6" onChange={(e)=>{setUserAccount(e.target.value);
                            getUserCheckedItems(e.target.value, circulation).length > 4 ? handleShowOverLimitError() : console.log('')}}>
                        <option selected disabled>Choose...</option>
                        {usersList && usersList.map((item)=>{
                            return <option value={item._id}>{getUserAccount(item._id)}</option>
                        })}
                    </select>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex3" className="fw-bold">User Name</label>
                        <input className="form-control" id="ex3" type="text" readOnly value={getUserName(userAccount)}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex3" className="fw-bold">Checkout Date</label>
                        <input className="form-control" id="ex3" type="date" readOnly defaultValue={checkoutDate}/>
                    </div>
                    <div className="col-xs-12 col-lg-3 mt-3">
                        <label htmlFor="ex3" className="fw-bold">Due Date</label>
                        <input className="form-control" id="ex3" type="date" readOnly defaultValue={dueDate}/>
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
                            displayValue= 'displayName'
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
                            displayValue= 'displayName'
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
                            displayValue= 'displayName'
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
            <Modal show={showUserError} onHide={handleCloseUserError} backdrop='static' keyboard='false'
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>Please select a User Account.</h4>                                                                           
                        </div>
                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseUserError} className=" btn-warning mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
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
            <Modal show={showOverLimitError} onHide={handleCloseOverLimitError} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>User currently has 5 items checked out.</h4>
                            <h4>This is the maximum number allowed.</h4>                                                                           
                        </div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseOverLimitError} className=" btn-warning mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAllowableItemsError} onHide={handleCloseAllowableItemsError} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>User currently has {allowableItems} items checked out.</h4>
                            <h4>They may only select {5 - allowableItems} more items.</h4>                                                                           
                        </div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseAllowableItemsError} className=" btn-warning mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showItemLimitError} onHide={handleCloseItemLimitError} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>Too many items selected.</h4>
                            <h4>Users may borrow up to 5 items.</h4>                                                                                                      
                        </div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseItemLimitError} className=" btn-warning mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSuccessful} onHide={handleCloseSuccessful} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div>                                         
                        <div className="errorModal">           
                            <h4>Items successfully checked out!</h4>
                        </div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseSuccessful} className=" btn-success mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showHolds} onHide={handleCloseHolds} backdrop='static' keyboard='false' 
                style={{marginTop: 100}}>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4"></div> 
                        <h4>The following items are On Hold:</h4>                                        
                        <div className="holdsModal mt-4" dangerouslySetInnerHTML={{__html: holdsMessage}}></div>                    
                </Modal.Body>
                <Modal.Footer>                    
                    <Button onClick={handleCloseHolds} className=" btn-warning mx-auto author-button fw-bold">
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>        
    )
};

export default Checkout;