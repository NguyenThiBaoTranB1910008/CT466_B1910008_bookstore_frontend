const initState = {
    loginAccount:  localStorage.getItem('user') ?? "",
    loginId:  localStorage.getItem('iduser') ?? 0,
    isAdmin: false,
    cartItem: parseInt(localStorage.getItem('cartlength')) ??  0,
    newNotify: [] 
}

const LOGIN_ACTION = "login"
const LOGOUT_ACTION = "logout"
const UPDATE_CART_NUMBER= "updatecart"
const INCREASE_CART_NUMBER= "incart"
const DECREASE_CART_NUMBER= "decart"
const SEEN_NOTIFY = "seen"

function reducer(state, action){
    switch (action.type){
        case LOGIN_ACTION:
            console.log(action)
            localStorage.setItem('cartlength', action.cartItem )
            localStorage.setItem('iduser', action.id )
            return {
                // ...state,
                loginAccount:action.name,
                loginId: action.id,
                cartItem: action.cartItem,
                newNotify: action.newNotify,
                isAdmin: action.isAdmin
            }
        case LOGOUT_ACTION:
            localStorage.removeItem('user');
            return {
                ...state,
                loginAccount: "",
                isAdmin: false,
            }
        case UPDATE_CART_NUMBER:
            localStorage.setItem('cartlength',action.cartItem)
            return{
                ...state,
                cartItem: action.cartItem,
            }
        case INCREASE_CART_NUMBER:
            var cartlength= parseInt(state.cartItem) + 1;
            localStorage.setItem('cartlength',cartlength)
            return{
                ...state,
                cartItem: state.cartItem + 1
            }
        case DECREASE_CART_NUMBER:
            cartlength= parseInt(state.cartItem) - 1;
            localStorage.setItem('cartlength', cartlength )
            return{
                ...state,
                cartItem: state.cartItem - 1
            }
        case SEEN_NOTIFY:
            return{
                ...state,
                newNotify: []
            }
        default:
            console.log("default")
    }
}




export {initState}
export default reducer