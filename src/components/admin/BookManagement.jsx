import { useState, useEffect } from 'react';
import productService from '../../services/product.service';
import { currencyFormat, notify } from '../../auth.action';
import Modal from '../common/Modal';

function BookManagement({setEditBook, setAdminChoose}){
    const [books, setBooks]= useState([])
    const [filter, setFilter] = useState({change: false})
    const [activeModal, setActiveModal] = useState(false)
    async function fetchData(){
        try{
            const apibooks = await productService.getByFilter(filter)
            setBooks(apibooks)
        }
        catch(error){
            console.log(error);
        }
    }

    async function deleteB(id){
        try{
            await productService.delete(id)
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    useEffect(()=>{
        fetchData()
    },[filter])

    const adminsearch = ()=>{
        const search = document.getElementById('admin-input').value
        setFilter({search: search})
    }

    const deleteBook = (id) =>{
        deleteB(id)
        setActiveModal(false)
        setFilter({change: !filter.change})
        notify("success", "Xóa sản phẩm thành công")
    }

    return(
        <>
        {activeModal.active && <Modal item={activeModal.book} disagree= {setActiveModal} agree={deleteBook}/>}
        <div className="book-overview" id="book">
            <div className="admin-search">
                    <h1 className='admin-action'>Sách</h1>
                        <div className="admin-search row">
                            <div className="col-8">
                                <input className="form-control me-2 py-2 px-3" id="admin-input" type="text" placeholder="Tìm kiếm" onChange={() => adminsearch}/>
                                <i className="fa-sharp fa-solid fa-magnifying-glass header-input-icon" onClick={()=>adminsearch}></i></div> 
                            <div className="col-4">
                                <div className='admin-add-button mx-2' onClick={()=> { setAdminChoose('edit'); setEditBook(null)}}>
                                <i class="fa-solid fa-plus"></i>
                                    New
                                </div>
                            </div>
                    </div>
                </div>
                <div className='admin-book table-borderless'>
                    <div className='header-cart-item row header-order mt-3'>
                        <div className="col-5">Tên sách</div>
                        <div className="col-3">Giá</div>
                        <div className="col-2">Tác giả</div>
                        <div className="col-2"></div>
                    </div>
                    <div>
                    { books.map((book, index) => (
                        <div key={index} className="order-item row py-1">
                            <div className='col-5 row list-book'>
                                <img  src={book.imageUrl} className="admin-book-img order-detail-img col-3"></img> 
                                <div className='col-9'>
                                 {book.title}
                                </div>
                            </div>
                            <div className='col-2'>
                                <span className='admin-book-price mr-2'>
                                    {currencyFormat(book.price)}
                                 </span>
                            </div>
                                <div className='col-2'>{book.author}</div>
                                <div className='col-3'>
                                    <div className='action-buttons d-flex justify-content-end'>
                                            <div onClick={()=> { setAdminChoose('edit'); setEditBook(book)}}
                                                className='admin-edit-button mx-2'>
                                                    <i className='fas fa-edit'></i>
                                                    Edit
                                                </div>
                                            <div
                                            onClick={() => setActiveModal({
                                                active: true,
                                                book: book})}
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
        </>
    )
}

export default BookManagement