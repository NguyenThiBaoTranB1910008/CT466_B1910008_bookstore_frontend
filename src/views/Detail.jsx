// import './Detail.css'
import { useState, useEffect, useContext } from 'react';
import ProductService from '../services/product.service'
import CartService from '../services/cart.service'
import { useParams, useNavigate } from "react-router-dom"
import Context from "../store/Context";
import { notify, currencyFormat } from '../auth.action';
import AppHeader from '../components/common/header/AppHeader';
import AppFooter from '../components/common/footer/AppFooter';
import Comment from '../components/detail/Comment';

function Detail(){
    const {id} = useParams()
    const [book, setBook] = useState({})
    const [state, dispatch] = useContext(Context)
    const [salebox, setSalebox] = useState({
        total: 0,
        quantity: 0,
    })
    const navigate = useNavigate()
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
    useEffect(() => {
        fetchData()
    },[id]);

    const addToCart = async (book) =>{
        const quantity = document.getElementById('quantity') 
        var bookExit
        try {
            bookExit= await CartService.get(book.id, {user: state.loginId})
            console.log(bookExit)
        } catch (error) {
            console.log(error);
        }
        if(state.loginId === 0)
            notify('warning',"Đăng nhập vào tài khoản để mua hàng bạn nhé")
        else if (bookExit.length ===0){
           var cartItem={
             idUser: state.loginId,
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
           bookExit[0].quantity= bookExit[0].quantity + parseInt( quantity.value)
            try {
               await CartService.update(bookExit[0].id, bookExit[0])
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
           navigate('/checkout', {state: {cart: [cartItem]}} )
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
                        <div className="row detailbook-info">
                            <div className="col-4">
                            <div className="detail-boximg ">
                                <div className="detail-img">
                                    <img src={book.imageUrl} alt="" />
                                </div>
                            </div>
                    </div>
                    <div className="col-8">
                        <p className="detail-author">
                            Tác giả: {book.author}
                        </p>
                        <p className="detail-name">
                            {book.title}
                        </p>
                        <p className='book-price detail-price'>{currencyFormat(book.price)}</p>
                        <p className="detail-title">
                            Thông tin
                            <span style={{textAlign:'right'}}>Kho : {book.quantity}</span>
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
                                    <span>Loại bìa</span>
                                    <p>{book.type}</p>
                                </span>
                            </li>
                            <li>
                                <span>
                                    <span>Kích thước</span>
                                    <p>{book.size} cm</p>
                                </span>
                                <span>
                                    <span>Ngôn ngữ</span>
                                    <p>{book.language}</p>
                                </span>
                            </li>
                        </ul>
                        </div>
                        <div className="detail-sum">
                            <h4 className='detail-total'>Đặt điểm nổi bật</h4>
                            <li>
                                <ul>
                                    <img src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                    <span>{book.highlight1}</span>
                                </ul>
                                <ul>
                                    <img src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                    <span>{book.highlight2}</span>
                                </ul>
                                <ul>
                                    <img src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                    <span>{book.highlight3}</span>
                                </ul>
                            </li>
                            
                        </div>
                        <div className="detail-description">
                            <h4>Tóm tắt tác phẩm</h4>
                            {book.description ?
                            <>
                            <p>{book.description.split("\n")[0]}</p>
                            <p>{book.description.split("\n")[1]}</p>
                            <p>{book.description.split("\n")[2]}</p>
                            <p>
                                {book.description.split("\n")[3]}
                                <br />
                                {book.description.split("\n")[4]}
                                <br />
                                {book.description.split("\n")[5]}
                                <br />
                                {book.description.split("\n")[6]}
                                <br />
                                {book.description.split("\n")[7]}
                            </p>
                            <p>{book.description.split("\n")[8]}</p>
                            </> : ""}
                        </div>
                        </div>
                        <Comment id = {id}  reload = {fetchData}/>
                    </div>
                    {
                        book.quantity!==0  ?
                    <div className="col-2 detail-salebox">
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
