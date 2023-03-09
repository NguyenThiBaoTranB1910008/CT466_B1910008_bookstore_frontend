import { currencyFormat } from "../../auth.action"
function CartItem({cartItem,setQualityCart,setActiveModal}){
    return(
        <div className="cart-item row">
            <div className="cart-item-img">
                <img src={cartItem.imgUrl} alt="" />
            </div>
            <div className="cart-item-name-price">
                <div className="cart-item-name">
                    {cartItem.title}
                </div>
                <p className="cart-item-price">{currencyFormat(cartItem.price)}</p>
            </div>
            <div className="salebox-quality col-2 p-0">
                <button onClick={()=>setQualityCart(cartItem.id, cartItem.quality -1)}>
                    <i class="fa-solid fa-minus"></i>
                </button>
                    <input type="text" value={cartItem.quality}/>
                <button onClick={()=>setQualityCart(cartItem.id, cartItem.quality + 1)}>
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div className="cart-item-total col-2">
                {currencyFormat(cartItem.quality * cartItem.price)}
            </div>
            <div className="cart-item-trash col-1">
                <i class="fa-regular fa-trash-can" onClick={()=>{setActiveModal({active: true, item: cartItem})}}></i>
             </div>
        </div>
    )
}

export default CartItem