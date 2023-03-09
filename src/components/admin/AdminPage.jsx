import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { notify } from '../../auth.action';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../../store/Context';
import BookManagement from './BookManagement';
import OrderManagment from './OrderManagment';
import UserManagement from './UserManagement';
import userService from '../../services/user.service';
import AdminBookDetail from './AdminBookDetail';
function AdminPage(){
    const [adminChoose, setAdminChoose] = useState("book")
    const [editbook, setEditBook] = useState()
    const [state, dispatch] = useContext(Context)
    const [userName, setUserName] = useState("")
    const navigate = useNavigate()
    const handleLogout = () =>{
        setAdminChoose('logout')
        dispatch({
            type: "logout"
        })
        navigate('/')
        notify('success',"Đăng xuất thành công")
    }

    useEffect(()=> {
        async function getUserName(){
          try{
            const userObj = await userService.checkAcc(state.loginAccount)
            setUserName(userObj.fullname.slice(userObj.fullname.lastIndexOf(" ") +1))
          }
          catch(error){
            console.log(error);
          }
        }
        if(state.loginAccount !== "")
          getUserName()
    },[state])

    return(
        <>
            <div className="col-2 admin p-0" >
                <div className="admin-logo px-4">
                    {/* <img src="./book1.png" alt="" className="logo"/> */}
                    <img src="./name1.png" alt="Page By Page" className="admin-logoword" />
                </div>
                <ul className='admin-list'>
                    <div onClick={()=>setAdminChoose('book')}>
                    <li className={adminChoose!=="book" && adminChoose!=="edit" ? "admin-list-item" : "admin-list-item admin-selected"} 
                        onClick={() => setAdminChoose("book")} >
                        <i class="fa-solid fa-book"></i>
                        <span>Sách</span>
                    </li>
                    </div>
                   <div onClick={()=>setAdminChoose('user')}>
                    <li className={adminChoose!=="user" ? "admin-list-item" : "admin-list-item admin-selected"}
                        onClick = {() =>setAdminChoose("user")}>
                        <i class="fa-solid fa-user"></i>
                        <span>Người dùng</span>
                    </li>
                    </div>
                    <div onClick={()=>setAdminChoose('order')}>
                    <li className={adminChoose!=="order" ? "admin-list-item" : "admin-list-item admin-selected"}
                        onClick = {() =>setAdminChoose("order")}>
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span>Đơn hàng</span>
                    </li>
                    </div>
                    <li className="admin-list-item"
                        onClick = {handleLogout}>
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Đăng xuất</span>
                    </li>
                </ul>
            </div>
            <div className="col-10 px-5 pt-3 book-overview">
                <div className="admin-header px-3">
                          Hello, {userName}
                    <div className="header-icon mx-2">
                        <i className="fa-solid fa-user px-1"></i>
                    </div>
                </div>
                {
                    adminChoose === 'book' && <BookManagement setEditBook={setEditBook} setAdminChoose={setAdminChoose}/>

                }
                {
                    adminChoose === 'user' && <UserManagement/>
                }
                {
                    adminChoose === 'order' && <OrderManagment/>
                }
                {
                    adminChoose === 'edit' && <AdminBookDetail editbook={editbook}/>
                }
            </div>
           
        </>
  );
};

export default AdminPage