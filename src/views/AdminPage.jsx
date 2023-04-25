import { useState, useEffect, useContext} from 'react';
import userService from '../services/user.service';
import Context from '../store/Context';
import BookManagement from '../components/admin/BookManagement';
import OrderManagment from '../components/admin/OrderManagment';
import UserManagement from '../components/admin/UserManagement';
import AdminBookDetail from '../components/admin/AdminBookDetail';
import Navigation from '../components/admin/Navigation';

function AdminPage(){
    const [adminChoose, setAdminChoose] = useState("book")
    const [editbook, setEditBook] = useState()
    const [state, dispatch] = useContext(Context)
    const [userName, setUserName] = useState("")

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
        <div className="row">
            <Navigation adminChoose={adminChoose} setAdminChoose={setAdminChoose} state={state}/>
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
                    adminChoose === 'edit' && <AdminBookDetail editbook={editbook} setAdminChoose={setAdminChoose}/>
                }
            </div>
        </div>
        </>
  );
};

export default AdminPage