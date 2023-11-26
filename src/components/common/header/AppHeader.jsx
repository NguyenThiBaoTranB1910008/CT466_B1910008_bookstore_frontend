import "./AppHeader.css"
import { useState, useEffect } from "react"
import { Link} from "react-router-dom"
import { useContext, useRef } from 'react';
import Context from "../../../store/Context";
import userService from "../../../services/user.service";
import { notify } from "../../../auth.action";
import { useNavigate } from "react-router-dom";

function AppHeader() {
  const [showMenu, setshowMenu] = useState(false)
  const [state,dispatch] = useContext(Context)
  const [userName, setUserName] = useState("")
  const mysearch = useRef()
  const navigate = useNavigate()
  async function getUserName(){
    try{
      const userObj = await userService.checkAcc(state.loginAccount)
      setUserName(userObj.fullname.slice(userObj.fullname.lastIndexOf(" ") +1))
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(()=> {
    if(state.loginAccount !== "")
      getUserName()
  },[state])
 
  const handlelogout = ()=>{
    dispatch({
      type: "logout",
    })
    notify('success',"Đăng xuất thành công")
    setshowMenu(false)
    navigate('/')
  }
  return (
  <>
    <header>
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/">
                  <img src="http://localhost:3000/book1.png" alt="" className="logo"/>
                  <img src="http://localhost:3000/name1.png" alt=""/>
                </Link>
                <Link to="/menu" className="menu" state={{cate: ""}}>
                    Danh Mục 
                </Link>
                <form className="">
                    <input className="form-control me-2" ref={mysearch} defaultValue="" id="header-input" type="text" placeholder="Tìm kiếm" />
                    <span onClick={()=> navigate(`/menu?search=${mysearch.current.value}`,{state:{ cate:""}})}><i className="fa-sharp fa-solid fa-magnifying-glass header-input-icon"></i></span>
                </form>
                {(state.loginAccount === "") ? <Link to="/login"><div className="login-text">Đăng nhập</div></Link> :
                    <div className="header-icon px-3">
                      <i className="fa-solid fa-user p-x1" onClick={()=>setshowMenu(!showMenu)}></i>
                      <ul className="sub-user" style={{display: (showMenu) ? "block" : "none"}} onClick={()=>setshowMenu(false)}>
                        <div className="hello-text">
                          Hello, {userName}
                        </div>
                        <Link to="/myorder" state={{cate: "order"}}><li>Đơn hàng của tôi</li></Link>
                        <Link to="/myorder" state={{cate: "announment"}}><li className="">
                          <span>Thông báo</span>  
                          {state.newNotify.length !== 0 && <span className="newNumber mx-3 my-1"></span>}</li>
                        </Link>
                        <Link to="/myorder" state={{cate: "info"}}>
                          <li>Thông tin tài khoản</li>
                        </Link>
                        <li onClick={handlelogout} className="logout">Đăng xuất</li>
                      </ul>
                    </div>}
                  <Link to="/cart">
                    <span className="cart-icon">
                      <i className="fa-solid fa-cart-shopping"></i>
                      {state.loginAccount !== "" &&
                      <span className="cart-number">{state.cartItem}</span>}
                    </span>
                  </Link>
            </div>
        </nav>
    </header>
  </>
  )
}
 
export default AppHeader;