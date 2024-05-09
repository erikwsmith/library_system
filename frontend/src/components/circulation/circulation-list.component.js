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
    const currency_formatting = {style: 'currency', currency: 'USD', minimumFractionDigits: 2};   

    const findUserName = (userAccount)=>{
        for(let i = 0; i < usersList.length; i++){
            if (userAccount === usersList[i]._id){
                return usersList[i].full_name;
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
    const findCallNumber = (id)=>{        
        let combinedArray = books.concat(movies, music);
        for(let i = 0; i < combinedArray.length; i++){
            if (id === combinedArray[i]._id){
                return combinedArray[i].callNumber;
            }
        }        
    };
    useEffect(()=>{
        const fetchCirculation = async() => {
            //const response = await fetch('http://localhost:4000/circulation');
            const response = await fetch('https://library-system-rydv.onrender.com/circulation');
            const json = await response.json();
            if(response.ok){
                const filterResults = json.filter((item)=> {
                    if (item.itemTitle.toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.itemID && findCallNumber(item.itemID).toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.userAccount && (findUserAccount(item.userAccount)).toString().includes(searchVal.toLowerCase()) || 
                        item.userAccount && findUserName(item.userAccount).toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.itemType && item.itemType.toLowerCase().includes(searchVal.toLowerCase()) ||
                        formatDate(item.checkoutDate).toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.returnDate && formatDate(item.returnDate).toLowerCase().includes(searchVal.toLowerCase()) ||
                        formatDate(item.dueDate).toLowerCase().includes(searchVal.toLowerCase())

                    ) {
                        return item;
                    }
                });
                setCirculation(filterResults);                    
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
        fetchBooks();
        fetchMovies();
        fetchMusic();
    }, [searchVal]);

    return (
        <div className="container">
        <div id="pageTitle">
            <h1>Circulation</h1>  
            <div className="input-group search-bar">                    
                <input type="text" className="form-control " placeholder="Search..." 
                    onChange={(e) => {setSearchVal(e.target.value)}} />                
            </div>   
        </div> 
        <table className="table table-hover ">
                <thead>
                    <tr>
                        <th>User<span className="opacity-0">_</span>ID</th>  
                        <th>User<span className="opacity-0">_</span>Name</th>                      
                        <th>Call<span className="opacity-0">_</span>Number</th>
                        <th>Title</th>  
                        <th>Type</th>
                        <th>Checkout</th>
                        <th>Due Date</th>
                        <th>Returned</th>
                        <th>Days<span className="opacity-0">_</span>Overdue</th>
                        <th>Fees</th>                                        
                    </tr>
                </thead>
                <tbody>
                    {circulation && circulation.map((item)=>(
                        <tr key={item._id}>
                            <td className="align-middle">{findUserAccount(item.userAccount)}</td>
                            <td className="align-middle">{findUserName(item.userAccount)}</td>
                            <td className="align-middle">{findCallNumber(item.itemID)}</td>
                            <td className="align-middle">{item.itemTitle}</td>
                            <td className="align-middle">{item.itemType}</td>                            
                            <td className="align-middle">{formatDate(item.checkoutDate)}</td>
                            <td className="align-middle">{formatDate(item.dueDate)}</td>
                            <td className="align-middle">{formatDate(item.returnDate)}</td>
                            <td className="align-middle text-center">{item.returnDate ? item.daysOverdue : ''}</td>
                            <td className="align-middle text-center">{item.returnDate ? new Intl.NumberFormat('en-US', 
                                currency_formatting).format(item.totalFees) : ''}</td>                                              
                        </tr>                    
                    ))}
                </tbody>
            </table>         
    </div> 
    );
};
export default CicrulationList;