import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/product.service';
import { currencyFormat } from '../../auth.action';
function BookManagement(){
    const [books, setBooks]= useState([])
    const [filter, setFilter] = useState({})
    useEffect(()=>{
        async function fetchData(){
        try{
            const apibooks = await productService.getByFilter(filter)
            setBooks(apibooks)
        }
        catch(error){
            console.log(error);
        }
    }
        fetchData()
    },[filter])

    const adminsearch = ()=>{
        const search = document.getElementById('admin-input').value
        setFilter({search: search})
    }
    return(
        <div className="col-10 px-5 pt-3 book-overview">
                <h1 className='admin-action'>Sách</h1>
                <div className="order-item admin-search">
                    <div className="col-4">
                <input className="form-control me-2" id="admin-input" type="text" placeholder="Tìm kiếm"/>
                    <i className="fa-sharp fa-solid fa-magnifying-glass header-input-icon" onClick={adminsearch}></i></div>
                    <div className="">
                        <Link to='/editbook' state={null}>
                            <div className='admin-add-button mx-2'>
                            <i class="fa-solid fa-plus"></i>
                                New Book
                            </div>
                        </Link>
                    </div>
                </div>
                <div className='admin-book table-borderless'>
                    <div className='header-cart-item row header-order'>
                        <div className="col-5">Tên sách</div>
                        <div className="col-3">Giá</div>
                        <div className="col-2">Tác giả</div>
                        <div className="col-2"></div>
                    </div>
                    <div>
                    { books.map((book, index) => (
                        <div key={index} className="order-item row py-1">
                            <div className='col-5'>
                                <img  src={book.imageUrl} className="admin-book-img order-detail-img"></img> 
                                {book.title}
                            </div>
                            <div className='col-2'>
                                <span className='admin-book-price mr-2'>
                                    {currencyFormat(book.price)}
                                 </span>
                            </div>
                                <div className='col-2'>{book.author}</div>
                                <div className='col-3'>
                                    <div className='action-buttons d-flex justify-content-end'>
                                            <Link to="/editbook" state={book}>
                                                <div
                                                className='admin-edit-button mx-2'>
                                                    <i className='fas fa-edit'></i>
                                                    Edit
                                                </div>
                                            </Link>
                                            <div
                                            // onClick={(e) => handleShowConfirmBox(_id, e)}
                                            className='admin-delete-button'>
                                                <i className='fas fa-trash'></i>
                                                Delete
                                            </div>
                                    </div>
                                </div>
                                </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}

export default BookManagement