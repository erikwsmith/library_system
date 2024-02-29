import { useEffect, useState} from 'react'
const {Button, Modal} = require('react-bootstrap');

const BooksList = () => {
    
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [show, setShow] = useState(false);
    const [deletedImage, setDeletedImage] = useState('');
    const [deletedTitle, setDeletedTitle] = useState('');
    const [deletedISBN, setDeletedISBN] = useState(null);
    const [deletedID, setDeletedID] = useState('');
    const [deleted, setDeleted] = useState('');

    // fetch records from backend on mount
    useEffect( ()=>{
        const fetchData = async()=>{
            //get all authors
            const authorQuery = await fetch('http://localhost:4000/authors');
            const authorJson = await authorQuery.json();
            if(authorQuery.ok) {    
                setAuthors(authorJson);    
            };            
            //get all books
            const bookQuery = await fetch('http://localhost:4000/books');
            let bookJson = await bookQuery.json();
            if(bookQuery.ok) { 
                const filterResults = bookJson.filter((item)=> {
                    const pageNum = item.pages.toString();
                    let authorString = '';
                    let authorArray = item.author.map((item)=>{
                        authorString += getAuthor(item) + ' ';
                    });                                                       
                    if (item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.isbn.includes(searchVal) ||
                        pageNum.includes(searchVal) ||
                        item.binding.toLowerCase().includes(searchVal.toLowerCase()) ||
                        authorString.toLowerCase().includes(searchVal.toLowerCase()) ||
                        item.classification.toLowerCase().includes(searchVal.toLocaleLowerCase())                        
                    ) {
                        return item;
                    }
                });            
                setBooks(filterResults);
            };            
        };
        fetchData();
    }, [searchVal, deleted] );

    const getAuthor= (authorID)=> {
        for (let i = 0; i < authors.length; i++) {
            if (authors[i]._id === authorID){
                return authors[i].full_name;
            }            
        }
    }
    const goToAddBook = () => {window.location='/books/add'};
    const handleClose = () => {setShow(false);}
    const handleShow = () => setShow(true);
    const deleteBook = async() => {
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
        let isbn = parentEl.getElementsByTagName("td")[3].innerHTML;
        let bookID = parentEl.getElementsByTagName("td")[7].firstChild.getAttribute("href");
        setDeletedImage(image);
        setDeletedTitle(title);
        setDeletedISBN(isbn);
        setDeletedID(bookID);
    };
    return (
        <div className="container mt-4">
            <div id="pageTitle">
                <h1>Books</h1>  
                <div class="input-group search-bar">                    
                    <input type="text" className="form-control " placeholder="Search..." 
                        onChange={
                            (e) => {
                                setSearchVal(e.target.value);
                            }
                        }
                    />
                    <button className="btn btn-success" type="button" id="button-addon2" onClick={goToAddBook}>
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
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Format</th>
                        <th>Pages</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {books && books.map((item)=>(
                        <tr key={item._id}>
                            <td style={{width:"10%"}}><img src={item.image} className="img-thumbnail" alt="Image Not Found"></img></td>
                            <td className="align-middle">{item.title}</td>
                            <td className="align-middle">
                                {item.author && item.author.map((record)=>{
                                    return <p>{getAuthor(record)}</p>
                                })} 
                            </td>
                            <td className="align-middle">{item.isbn}</td>
                            <td className="align-middle">{item.classification}</td>
                            <td className="align-middle">{item.binding}</td>
                            <td className="align-middle">{item.pages}</td>
                            <td className="align-middle actionButtons">
                                <a href={"/books/" + item._id} className="btn btn-sm btn-primary" data-bs-toggle="tooltip" 
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
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard='false'>
                <Modal.Body>
                    <div className="text-center fw-bold fs-4">Are you sure you want to delete?</div>
                    <div className = "book-wrapper">
                        <img src={deletedImage}></img>
                        <div className="bookModal">
                            <div>
                                <p>Title: <span>{deletedTitle}</span></p>
                            </div>
                            <div>
                                <p>ISBN: <span>{deletedISBN}</span></p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deleteBook} className="fw-bold btn-danger mx-auto author-button">
                    Delete Book
                    </Button>
                    <Button onClick={handleClose} className=" btn-secondary mx-auto author-button">
                    Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BooksList;

