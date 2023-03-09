import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/user.service.js';
import { notify } from '../../auth.action.js';

function UserManagement(){
    const [users, setUsers]= useState([])
    const [filter, setFilter] = useState({})
    useEffect(()=>{
        async function fetchData(){
        try{
            const apiuser = await UserService.getByFilter(filter)
            setUsers(apiuser)
        }
        catch(error){
            console.log(error);
        }
    }
        fetchData()
    },[filter])

    const adminsearch = ()=>{
        const search = document.getElementById('admin-input').value
        setFilter({search: search})
    }

    const handleDelete = async (id) =>{
        try{
            await UserService.delete(id)
            const apiuser = await UserService.getByFilter(filter)
            setUsers(apiuser)
            notify("success", "Xóa người dùng thành công")
        }
        catch(error){
            console.log(error);
        }
    }

    const beAdmin = async(id, isadmin) =>{
        try{
            await UserService.updateAdmin({id: id,
                isadmin: !isadmin})
            // await UserService.delete(id)
            const apiuser = await UserService.getByFilter(filter)
            setUsers(apiuser)
            if(isadmin)
                notify("success", "Xóa quyền admin thành công")
            else
                notify("success", "Cấp quyền admin thành công")
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="user-overview ">
                <h1 className='admin-action'>Người dùng</h1>
                <div className="order-item admin-search">
                    <div className="col-4">
                <input className="form-control me-2" id="admin-input" type="text" placeholder="Tìm kiếm"/>
                    <i className="fa-sharp fa-solid fa-magnifying-glass header-input-icon" onClick={adminsearch}></i></div>
                    <div className="">
                        <Link to='/editbook' state={null}>
                            <div className='admin-add-button mx-2'>
                            <i class="fa-solid fa-plus"></i>
                                New User
                            </div>
                        </Link>
                    </div>
                </div>
                <div className='admin-book table-borderless'>
                    <div className='header-cart-item row header-order'>
                        <div className="col-2">Tên tài khoản</div>
                        <div className="col-4">Họ Tên</div>
                        <div className="col-2">Loại tài khoản</div>
                        <div className="col-4"></div>
                    </div>
                    <div>
                    { users.map((user, index) => (
                        user.accname!== "admin" &&
                        <div key={index} className="order-item row py-3">
                            <div className='col-2'>
                                {/* <img  src={book.imageUrl} className="admin-book-img order-detail-img"></img>  */}
                                {user.accname}                            </div>
                            <div className='col-4'>
                                <span className='admin-book-price mr-2'>
                                    {user.fullname}
                                 </span>
                            </div>
                                <div className='col-2'>
                                    {
                                        (user.isadmin) ? "admin" : "basic"
                                    }
                                </div>
                                <div className='col-4'>
                                    <div className='action-buttons d-flex justify-content-end'>
                                            <div onClick={()=>beAdmin(user.id, user.isadmin)}
                                                className='admin-edit-button mx-2'>
                                                    <i className='fas fa-edit'></i>
                                                    {
                                                        !user.isadmin ? "Cấp quyền admin": "Xóa quyền admin"
                                                    }
                                                </div>
                                            <div
                                            onClick={() => handleDelete(user.id)}
                                            className='admin-delete-button'>
                                                <i className='fas fa-trash'></i>
                                                Delete
                                            </div>
                                    </div>
                                </div>
                                </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}

export default UserManagement