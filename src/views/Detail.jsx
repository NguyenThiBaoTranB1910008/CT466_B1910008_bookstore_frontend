// import './Detail.css'
import { useState, useEffect, useContext } from 'react';
import ProductService from '../services/product.service'
import CartService from '../services/cart.service'
import { useParams, useNavigate } from "react-router-dom"
import Context from "../store/Context";
import { notify, currencyFormat } from '../auth.action';
import AppHeader from '../components/common/header/AppHeader';
import AppFooter from '../components/common/footer/AppFooter';

function Detail(){
    const {id} = useParams()
    const [book, setBook] = useState([])
    const [state, dispatch] = useContext(Context)
    const [salebox, setSalebox] = useState({
        total: 0,
        quantity: 0,
    })
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchData(){
            try {
                const apibook = await ProductService.get(id);
                setBook(apibook)
                setSalebox({
                    total: apibook.price,
                    quantity:1
                })

            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    },[id]);

    const addToCart = async (book) =>{
        const quantity = document.getElementById('quantity') 
        var bookExit
        try {
            bookExit= await CartService.get(book.id, {user: state.loginAccount})
        } catch (error) {
            console.log(error);
        }
        if(state.loginAccount === "")
            notify('warning',"Đăng nhập vào tài khoản để mua hàng bạn nhé")
        else if (!bookExit){
           var cartItem={
             user: state.loginAccount,
             idbook : book.id,   
             title: book.title,
             price: book.price,
             imgUrl: book.imageUrl,
             quantity: parseInt( quantity.value)
           }
           try {
                await CartService.create(cartItem)
            } catch (error) {
                console.log(error);
            }

            dispatch({
                type: "incart"
            })
            
            notify("success","Đã thêm sản phẩm vào giỏ hàng")
        }else{
           bookExit.quantity= bookExit.quantity + parseInt( quantity.value)
            try {
               await CartService.update(bookExit.id, bookExit)
            } catch (error) {
               console.log(error);
            }
            notify("success","Đã cập nhật sản phẩm vào giỏ hàng")
        }
    }

    const checkout = async (book) =>{
        const quantity = document.getElementById('quantity') 
        if(state.loginAccount === "")
            navigate("/login")
        else{
           var cartItem={
             user: state.loginAccount,
             idbook : book.id,   
             title: book.title,
             price: book.price,
             imgUrl: book.imageUrl,
             quantity: parseInt( quantity.value)
           }
           navigate('/order', {state: {cart: [cartItem]}} )
        }
    }
    

    const changeQuality =(type) =>{
        var qua = salebox.quantity
        if(type ==="up" ){    
            if(qua < book.quantity)
                setSalebox({
                    total:book.price*(qua+1),
                    quantity: qua + 1
                })
        }
        else if(qua > 1)
            setSalebox({
                total:book.price*(qua-1),
                quantity: qua-1
            })
    }
      
    return(
        <>
        <AppHeader/>
            <div className="container main">
                <div className="row">
                    <div className="col-9">
                        <div className="row">
                            <div className="col-4">
                            <div className="detail-boximg ">
                                <div className="detail-img">
                                    <img src={book.imageUrl} alt="" />
                                </div>
                            </div>
                    </div>
                    <div className="col-8">
                        <p className="detail-author">
                            {book.author}
                        </p>
                        <p className="detail-name">
                            {book.title}
                        </p>
                        <p className='book-price detail-price'>{currencyFormat(book.price)}</p>
                        <p className="detail-title">
                            Thông tin
                        </p>
                        <ul className='detail-info'>
                            <li>
                                <span>
                                    <span>Số trang</span>
                                    <p>{book.page}</p>
                                </span>
                                <span>
                                    <span>Nhà xuất bản</span>
                                    <p>{book.brand}</p>
                                </span>
                            </li>
                            <li>
                                <span>
                                    <span>Năm phát hành</span>
                                    <p>{book.releaseDate}</p>
                                </span>
                                <span>
                                    <span>Ngôn ngữ</span>
                                    <p>{book.language}</p>
                                </span>
                            </li>
                        </ul>
                        </div>
                        <div className="detail-description">
                            <h4>Tóm tắt tác phẩm</h4>
                            <p>{book.description}</p>
                            
                        </div>
                    </div>
                    </div>
                    {
                        book.quantity!==0  ?
                    <div className="col-3 detail-salebox">
                        <p>Thêm vào giỏ hàng bạn nhé</p>
                        <div className="salebox-quantity">
                            <p>Số lượng</p>
                            <button onClick={() => changeQuality('down')}>
                                <i className="fa-solid fa-minus"></i>
                            </button>
                            <input type="text" value={salebox.quantity} className="detail-quantity" id="quantity"/>
                            <button onClick={() => changeQuality('up')}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div className="detail-total pt-1">
                            <span>Tổng</span>
                            <span>{currencyFormat(salebox.total)}</span>
                        </div>
                        <div className="boxsale-button">
                            <button className="boxsale-button-cart" onClick={()=>addToCart(book)}>
                                Giỏ hàng 
                                <i className="fa-solid fa-cart-shopping"></i>
                            </button>
                            <button className="boxsale-button-tt" onClick={()=> checkout(book)}>
                                Thanh toán
                            </button>
                        </div>
                    </div>
                    :
                    <div className="col-3 detail-salebox outofstock">
                        <p>Xin lỗi, quyển sách này đã hết hàng</p>
                        <span>Quý khách có thể lựa chọn các sản phẩm tương tự. Chúng tôi sẽ cố gắng khắc phục lỗi sớm nhất. Xin lỗi vì sự bất tiện này.</span>
                        <div className="line"></div>
                    </div>}
                </div>
            </div> 
        <AppFooter/>
        </>
    )
}

export default Detail;
