import "./AppHeader.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useContext } from 'react';
import Context from "../../../store/Context";

function AppHeader() {
  const [showMenu, setshowMenu] = useState(false)
  const [search, setSearch] =useState(false)
  const [state,dispatch] = useContext(Context)

  const headInput = () =>{
    const headInput= document.getElementById("header-input")
    if(headInput.value==="")
    setSearch("")
    else
    setSearch(`/${headInput.value}`)
  }

  const handlelogout = ()=>{
    // console.log(state)
    dispatch({
      type: "logout",
      name: ""
    })
    setshowMenu(false)
  }
  
  return (
  <>
    <header>
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                  <Link className="navbar-brand" to="/">
                    <img src="./book1.png" alt="" className="logo"/>
                    <img src="./name1.png" />
                  </Link>
                  {/* <div className="menu" onClick={()=>setshowMenu(!showMenu)}> */}
                   <Link to="/menu" className="menu" state={{category : ""}}>
                      {/* <span> */}
                      {/* <i class="fa-solid fa-list"></i> */}
                        Danh Mục Sách
                      {/* </span> */}
                    </Link>
                    {/* {showMenu ?  <i class="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    <ul className= {showMenu ? "sub-menu show" : "sub-menu" } >
                      <Link to="/edu"><li className="sub-menu-li">Tâm lý kỹ năng</li></Link>
                      <li className="sub-menu-li">Sách tham khảo</li>
                      <li className="sub-menu-li">Văn học </li>
                      <li className="sub-menu-li">Kinh tế</li>
                    </ul> */}
                  {/* </div> */}
                  <form className="">
                    <input className="form-control me-2" id="header-input" type="text" placeholder="Tìm kiếm" onChange={headInput}/>
                    <Link to={`/menu${search}`} state={{cate: ""}}><i className="fa-sharp fa-solid fa-magnifying-glass header-input-icon"></i></Link>
                  </form>
                  {(state.loginAccount === "") ? <Link to="/login"><div className="login-text">Đăng nhập</div></Link> :
                    <div className="header-icon px-3">
                      <i className="fa-solid fa-user px-1" onClick={()=>setshowMenu(!showMenu)}></i>
                      <ul className="sub-user" style={{display: (showMenu) ? "block" : "none"}} onClick={()=>setshowMenu(false)}>
                        <div className="hello-text">
                          Hello, Trân
                        </div>
                        <Link to="/myorder">Đơn hàng của tôi</Link>
                        <li onClick={handlelogout}>Đăng xuất</li>
                      </ul>
                    </div>}
                  <Link to="./cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </Link>
            </div>
        </nav>
    </header>
  </>
  )
}
 
export default AppHeader;