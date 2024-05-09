import {React, useState, useEffect, useRef} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createRoutesFromElements } from 'react-router-dom';
const {Button, Modal} = require('react-bootstrap');

const Return = () =>{ 
    
    const [returnDate, setReturnDate] = useState('');
    const [books, setBooks] = useState([]);
    const [music, setMusic] = useState([]);
    const [movies, setMovies] = useState([]);    
    const [circulation, setCirculation] = useState([]);
    const [billing, setBilling] = useState([]);    
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
        let newBillingArr = [];       
        for(let i=0; i < combinedArray.length; i++){            
            for(let rec = 0; rec < circulation.length; rec++){                
                let daysPastDue = 0;
                let fees = 0.00;
                if (circulation[rec].itemID === combinedArray[i]._id && (!circulation[rec].returnDate || 
                        circulation[rec].returnDate === '' || circulation[rec].returnDate === null)){
                    if(new Date(returnDate) > new Date(circulation[rec].dueDate)){
                        daysPastDue = (new Date(returnDate) - new Date(circulation[rec].dueDate)) / (1000*60*60*24);
                        fees = Math.trunc(daysPastDue) * 0.10; 
                    }
                    //update circulation record's return date, days overdue, and fees            
                    const itemRecord = {returnDate: new Date(returnDate), daysOverdue: daysPastDue, totalFees: fees};
                    //const itemResponse = await fetch('http://localhost:4000/circulation/' + circulation[rec]._id, {
                    const itemResponse = await fetch('https://library-system-rydv.onrender.com/circulation/' + circulation[rec]._id, {
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
                    const newObj = {circID: circulation[rec]._id, userAccount: circulation[rec].userAccount, 
                                    checkoutDate: circulation[rec].checkoutDate, dueDate: circulation[rec].dueDate, 
                                    itemTitle: circulation[rec].itemTitle, itemID: circulation[rec].itemID, 
                                    itemType: circulation[rec].itemType, daysOverdue: daysPastDue, returnDate: new Date(returnDate),
                                    totalFees: fees, payStatus: 'Not Paid'};                    
                    if(fees > 0){
                        newBillingArr.push(newObj); 
                    };
                }
            } // end inner loop

            const itemID = combinedArray[i]._id;            
            const itemType = combinedArray[i].type;
            let itemCollection = '';
            if(itemType === 'Book'){itemCollection = 'books/'};
            if(itemType === 'Movie'){itemCollection = 'movies/'};
            if(itemType === 'Music'){itemCollection = 'music/'};    

            //update item's checkout status            
            const itemRecord = {checkedOut: false};
            //const itemUpdate = await fetch('http://localhost:4000/' + itemCollection + itemID, {
            const itemUpdate = await fetch('https://library-system-rydv.onrender.com/' + itemCollection + itemID, {
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
        } //end outer loop    
        for(let n = 0; n < newBillingArr.length; n++){
            let index = billing.findIndex(item => item.userAccount === newBillingArr[n].userAccount);
            if(index === undefined || index === -1 || billing.length === 0 || !billing){
                let newObj = {userAccount: newBillingArr[n].userAccount, balance: newBillingArr[n].totalFees, circRecords: [newBillingArr[n]]};                  
                billing.push(newObj);
                //POST
                //const billingPost = await fetch('http://localhost:4000/billing/add', {
                const billingPost = await fetch('https://library-system-rydv.onrender.com/billing/add', {
                    method: 'POST',
                    body: JSON.stringify(newObj),
                    headers: {'Content-Type': 'application/json'}
                })
                const json = await billingPost.json();
                if(!billingPost.ok){
                    setError(json.error);
                    return;
                }
                if(billingPost.ok){            
                    console.log("it worked!");                                    
                }
            }else{
                billing[index].circRecords.push(newBillingArr[n]);                
                //PATCH
                let oldBalance = billing[index].balance;
                let updatedObj = {balance: newBillingArr[n].totalFees + oldBalance, 
                    circRecords: billing[index].circRecords};
                //const billingUpdate = await fetch('http://localhost:4000/billing/' + billing[index]._id, {
                const billingUpdate = await fetch('https://library-system-rydv.onrender.com/billing/' + billing[index]._id, {
                    method: 'PATCH',
                    body: JSON.stringify(updatedObj),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const billingJson = await billingUpdate.json();
                if(!billingUpdate.ok){
                    setError(billingJson.error);                                    
                }
                if(billingUpdate.ok){                    
                    console.log('Updated!: ', billingJson);                                    
                }     
            }
        };    
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
            //const response = await fetch('http://localhost:4000/books');
            const response = await fetch('https://library-system-rydv.onrender.com/books');
            const json = await response.json();            
            if(response.ok){
                const availableBooks = json.filter(findAvailableItems);
                availableBooks.forEach((i)=>{i.displayName = i.title + '  (' + i.callNumber + ')'});
                setBooks(availableBooks);                                   
            }
        };
        const fetchMovies = async() => {
            //const response = await fetch('http://localhost:4000/movies');
            const response = await fetch('https://library-system-rydv.onrender.com/movies');
            const json = await response.json();
            if(response.ok){
                const availableMovies = json.filter(findAvailableItems);
                availableMovies.forEach((i)=>{i.displayName = i.title + '  (' + i.callNumber + ')'});
                setMovies(availableMovies);                    
            }
        };
        const fetchMusic = async() => {
            //const response = await fetch('http://localhost:4000/music');
            const response = await fetch('https://library-system-rydv.onrender.com/music');
            const json = await response.json();
            if(response.ok){
                const availableMusic = json.filter(findAvailableItems);
                availableMusic.forEach((i)=>{i.displayName = i.title + '  (' + i.callNumber + ')'});
                setMusic(availableMusic);                    
            }
        };
        const fetchCirculation = async() => {
            //const response = await fetch('http://localhost:4000/circulation');
            const response = await fetch('https://library-system-rydv.onrender.com/circulation');
            const json = await response.json();
            if(response.ok){                
                setCirculation(json);                    
            }
        };
        const fetchBilling = async() => {
            //const response = await fetch('http://localhost:4000/billing');
            const response = await fetch('https://library-system-rydv.onrender.com/billing');
            const json = await response.json();
            if(response.ok){                
                setBilling(json);                    
            }
        };
        fetchBooks();
        fetchMovies();
        fetchMusic();
        fetchCirculation();
        fetchBilling();
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