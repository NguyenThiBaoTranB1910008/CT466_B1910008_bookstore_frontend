import './Detail.css'
import {useState, useEffect} from 'react'
import CartService from '../services/cart.service'
import { Link } from "react-router-dom"
import EmptyCart from '../components/cart/EmptyCart'
import ListCartItem from '../components/cart/ListCartItem'
import { useContext } from 'react';
import Context from "../store/Context";
import { currencyFormat } from '../auth.action'
import { useNavigate } from 'react-router-dom';
import { notify } from '../auth.action'
import { getCartNumber } from '../auth.action'
import { type } from '@testing-library/user-event/dist/type'
import Modal from '../components/common/Modal'

function Cart(){
    const [cart, setCart] = useState([])
    const [changQuality, setChangQuality] = useState(false)
    const [total, setTotal] = useState(0)
    const [state, dispatch] = useContext(Context)
    const [activeModal, setActiveModal] = useState(false)
    const navigate = useNavigate()
    var totalprice
    var apicart=[]
    useEffect(()=>{
        async function fetchData(){
            try {
                apicart = await CartService.getAll(state.loginAccount);
                setCart(apicart) 
                totalprice=0 
                apicart.map((cartItem) =>{
                    totalprice += cartItem.price*cartItem.quality
                })
                setTotal(totalprice)
            } catch (error) {
                console.log(error);
            }
        }
        if(state.loginAccount === ""){
            navigate('/login')
        }else
            fetchData()
    },[changQuality]);

    const setQualityCart = async (id, quality) => {
        const cartExit = cart.find((item) => item.id === id)
        if (quality <=0 ) 
            cartExit.quality = 1
        else 
            cartExit.quality = quality
        try {
            await CartService.update(id, cartExit);    
        } catch (error) {
            console.log(error);
        }
        setChangQuality(!changQuality)
    }

    const deleteCartItem = (id) =>{
        // console.log(id)
        async function deleteCart(){
            try {
                await CartService.delete(id);    
            } catch (error) {
                console.log(error);
            }
        }
        deleteCart()
        setActiveModal({active:false})
        setChangQuality(!changQuality)
        dispatch({
            type:"decart",
        })
    }
    
    return(
        <>
        {activeModal.active && <Modal item={activeModal.item} disagree={setActiveModal} agree={deleteCartItem}/>}
        <div className="container main">
            <div className="row cart">
                    {(cart.length===0) ? <EmptyCart imgUrl={"https://www.gramedia.com/assets/illustrations/empty-cart.png"}
                                                    title = {"Giỏ hàng của bạn đang rỗng"}/> :
                        <>
                <div className="col-8">
                        <ListCartItem cart={cart} currencyFormat={currencyFormat} setQualityCart={setQualityCart} setActiveModal={setActiveModal}/>
                    </div>
                <div className="col-1"></div>
                <div className="col-3 cart-total">
                    <div className="cart-total-header">
                        <h4>Thông tin đơn hàng</h4>
                    </div>
                    <div className="cart-total-detail p-3">
                        <div className="cart-detail-price">
                            <span>Tổng tiền</span>
                            <span>{currencyFormat(total)}</span>
                        </div>
                        <Link to={(state.loginAccount == "") ? "/login" :"/order"} state={{cart: cart}}><button>ĐẶT HÀNG</button></Link>  
                    </div>
                </div>
                </>
                }
                </div> 
            </div>
        </>
    )
}

export default Cart;