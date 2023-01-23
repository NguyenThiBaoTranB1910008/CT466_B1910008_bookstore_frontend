const initState = {
    loginAccount:  ""
}

const LOGIN_ACTION = "login"
const LOGOUT_ACTION = "logout"

function reducer(state, action){
    // console.log(state.loginAccount)
    switch (action.type){
        case LOGIN_ACTION:
            // localStorage.setItem("user", action.name);
            return {
                loginAccount:action.name
            }
            // console.log(state)
            // break;
        case LOGOUT_ACTION:
            // localStorage.setItem("user", action.name);
            // state.loginAccount = action.name
            console.log(state)
            // break;
            return {
                loginAccount: ""
            }
            // localStorage.removeItem('user');
            // console.log(state)
            // break;
        default:
            console.log("default")
    }
}

export {initState}
export default reducer