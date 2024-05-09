import {React, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
const {Button, Modal, Collapse} = require('react-bootstrap');

const BillingList = () => {        

    const [billingList, setBillingList] = useState([]);
    const [circulation, setCirculation] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [collapse, setCollapse] = useState(false);
    const toggleRef = useRef();
    const billingListRef = useRef();
    const [books, setBooks] = useState([]);
    const [music, setMusic] = useState([]);
    const [movies, setMovies] = useState([]);
    
    const formatDate = (date) => {
        if(date){  
            const dateStr = date.toString();
            const timeIndex = date.indexOf('T');           
            const _date = dateStr.substring(0,timeIndex);
            const [year, month, day] = _date.split('-');
            return month + '/' + day + '/' + year;
        }
    }    
    const currency_formatting = {style: 'currency', currency: 'USD', minimumFractionDigits: 2};   
    
    const filterByUser =(arr, userID)=>{
        const filterData =(data)=>{
            if(data.userAccount === userID && data.totalFees > 0){
                return data;
            }
        };
        return arr.filter(filterData);
    }

    const toggleCollapse = (element) => {   
        if(collapse){
            element.current.innerHTML = '<span class="material-symbols-outlined">expand_less</span>'
        }else{
            element.current.innerHTML = '<span class="material-symbols-outlined">expand_more</span>'        
        };
    };
    const getUserName = (userID) => {
        for(let i = 0; i < usersList.length; i++){
            if(usersList[i]._id === userID){                
                return usersList[i].full_name;
            }
        }               
    };
    const findCallNumber = (id)=>{        
        let combinedArray = books.concat(movies, music);
        for(let i = 0; i < combinedArray.length; i++){
            if (id === combinedArray[i]._id){
                return combinedArray[i].callNumber;
            }
        }        
    };
    const findUserAccount = (userAccount)=>{
        for(let i = 0; i < usersList.length; i++){
            if (userAccount === usersList[i]._id){
                return usersList[i].user_id;
            }
        }        
    };
    const toggleBilling = (event) => {

        event.target.nextElementSibling.classList.toggle("content");
    }
    useEffect(()=>{
        const fetchCirculation = async() => {
            //const response = await fetch('http://localhost:4000/circulation');
            const response = await fetch('https://library-system-rydv.onrender.com/circulation');
            const json = await response.json();
            if(response.ok){
                setCirculation(json);                    
            }
        };      
        const fetchUsers = async() => {
            //const response = await fetch('http://localhost:4000/users');
            const response = await fetch('https://library-system-rydv.onrender.com/users');
            const json = await response.json();
            if(response.ok){
                setUsersList(json);                    
            }
        };       
        const fetchBilling = async() => {
            //const response = await fetch('http://localhost:4000/billing');
            const response = await fetch('https://library-system-rydv.onrender.com/billing');
            const json = await response.json();
            if(response.ok){                
                const filterResults = json.filter((item)=> {
                    let user_account = findUserAccount(item.userAccount);
                    if(user_account === undefined){user_account = ''};
                    let user_name = getUserName(item.userAccount);
                    if(user_name === undefined){user_name = ''};
                    if (item.userAccount && user_account !== undefined && user_account.toString().toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.userAccount && user_name !== undefined  && user_name.toLowerCase().includes(searchVal.toLowerCase())
                    ) {
                        return item;
                    }
            })
            setBillingList(filterResults);         
            }   
        };
        const fetchBooks = async() => {
            //const response = await fetch('http://localhost:4000/books');
            const response = await fetch('https://library-system-rydv.onrender.com/books');
            const json = await response.json();
            if(response.ok){
                setBooks(json);                    
            }
        };
        const fetchMovies = async() => {
            //const response = await fetch('http://localhost:4000/movies');
            const response = await fetch('https://library-system-rydv.onrender.com/movies');
            const json = await response.json();
            if(response.ok){
                setMovies(json);                    
            }
        };
        const fetchMusic = async() => {
            //const response = await fetch('http://localhost:4000/music');
            const response = await fetch('https://library-system-rydv.onrender.com/music');
            const json = await response.json();
            if(response.ok){
                setMusic(json);                    
            }
        };        
        fetchCirculation();
        fetchUsers();        
        fetchBilling();
        fetchBooks();
        fetchMovies();
        fetchMusic();
    }, [searchVal]);

    return (
        <div className="container">
        <div id="pageTitle">
            <h1>Billing</h1>  
            <div className="input-group search-bar">                    
                <input type="text" className="form-control " placeholder="Search by User ID or User Name..." 
                    onChange={(e) => {setSearchVal(e.target.value)}} />                
            </div>   
        </div>
        <div className="col-xs-12 col-lg-12 mt-3">
            {billingList && billingList.map((item)=>( 
                <div key={item._id} className=" mt-2">
                    <button type="button" className=" w-100 btn btn-primary billingButton" 
                        onClick={(e)=>toggleBilling(e)}>
                        <div className="billing-card">
                            <div class="billing-card-user">
                                <span className="billingSpan">                            
                                    <label>User ID: </label><p className="billingInput"> {findUserAccount(item.userAccount)}</p>                        
                                </span>  
                                <span className="billingSpan">                            
                                    <label>Name: </label><p className="billingInput"> {getUserName(item.userAccount)}</p>                        
                                </span>
                            </div>
                            <div className="billing-card-balance">
                                <span className="billingSpan">                            
                                    <label>Balance: </label><p className="billingInput"> {new Intl.NumberFormat('en-US', 
                                        currency_formatting).format(item.balance)}</p>                        
                                </span>
                            </div>
                        </div>    
                    </button>
                    <div className="">
                        <table className="table table-hover ">
                            <thead>
                                <tr>                                                       
                                    <th>Call<span className="opacity-0">_</span>Number</th>
                                    <th>Title</th>  
                                    <th>Type</th>
                                    <th>Checkout</th>
                                    <th>Due Date</th>
                                    <th>Returned</th>
                                    <th>Days<span className="opacity-0">_</span>Overdue</th>
                                    <th>Fees</th>         
                                    <th>Status</th>                                                  
                                </tr>
                            </thead>
                            <tbody>
                                {item.circRecords.map((rec)=>(
                                    <tr key={rec._id}>                                        
                                        <td className="align-middle">{findCallNumber(rec.itemID)}</td>
                                        <td className="align-middle">{rec.itemTitle}</td>
                                        <td className="align-middle">{rec.itemType}</td>                            
                                        <td className="align-middle">{formatDate(rec.checkoutDate)}</td>
                                        <td className="align-middle">{formatDate(rec.dueDate)}</td>
                                        <td className="align-middle">{formatDate(rec.returnDate)}</td>
                                        <td className="align-middle">{rec.daysOverdue}</td>
                                        <td className="align-middle">{rec.returnDate ? new Intl.NumberFormat('en-US', 
                                currency_formatting).format(rec.totalFees) : ''}</td>   
                                        <td className="align-middle">{rec.payStatus}</td>                                                                                              
                                    </tr>                    
                                ))}
                            </tbody>
                        </table> 
                    </div>
                </div>                   
            ))}                                             
        </div>        
    </div> 
    );
};
export default BillingList;