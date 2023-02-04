import { notify } from "../auth.action";
const initState = {
    loginAccount:  localStorage.getItem('user') ?? ""
}

const LOGIN_ACTION = "login"
const LOGOUT_ACTION = "logout"

function reducer(state, action){
    // console.log(state.loginAccount)
    switch (action.type){
        case LOGIN_ACTION:
            localStorage.setItem("user", action.name);
            return {
                loginAccount:action.name
            }
        case LOGOUT_ACTION:
            localStorage.removeItem('user');
            return {
                loginAccount: ""
            }
        default:
            console.log("default")
    }
}

export {initState}
export default reducer