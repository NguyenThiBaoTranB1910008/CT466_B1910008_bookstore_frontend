
const initState = {
    loginAccount:  localStorage.getItem('user') ?? "",
    cartItem: 0,
    newNotify: [] 
}

const LOGIN_ACTION = "login"
const LOGOUT_ACTION = "logout"
const INCREASE_CART_NUMBER= "incart"
const DECREASE_CART_NUMBER= "decart"
const UPDATE_CART = "updatecart"
const SEEN_NOTIFY = "seen"

function reducer(state, action){
    switch (action.type){
        case LOGIN_ACTION:
            return {
                // ...state,
                loginAccount:action.name,
                cartItem: action.cartItem,
                newNotify: action.newNotify
            }
        case LOGOUT_ACTION:
            localStorage.removeItem('user');
            return {
                ...state,
                loginAccount: ""
            }
        case INCREASE_CART_NUMBER:
            return{
                ...state,
                cartItem: state.cartItem + 1
            }
        case DECREASE_CART_NUMBER:
            return{
                ...state,
                cartItem: state.cartItem - 1
            }
        case UPDATE_CART:
            return{
                ...state,
                cartItem: action.cartItem
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