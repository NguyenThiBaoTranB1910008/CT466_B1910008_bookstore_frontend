import CartItem from "./CartItem"
function ListCartItem({cart,currencyFormat,setQualityCart,deleteCartItem}){
    return(
        <>
        <div className="header-cart-item row">
            <div className="col-7">Sản phẩm</div>
            <div className="col-2">Số lượng</div>
            <div className="col-2">Thành tiền</div>
            <div className="col-1"></div>
        </div> 
        {
            cart.map((cartItem,index) => (
               <CartItem cartItem={cartItem} currencyFormat={currencyFormat} setQualityCart={setQualityCart} deleteCartItem={deleteCartItem}/>               
            ))
        }
        </>
    )
}

export default ListCartItem