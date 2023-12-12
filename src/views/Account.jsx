import { useEffect, useState, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Context from "../store/Context";
import userService from "../services/user.service";
import { notify } from "../auth.action"
import AccountInfo from "../components/account/AccountInfo"
import Announment from "../components/account/Announment";
import AccountAddress from "../components/account/AccountAddress";
import AccountComment from "../components/account/AccountComment";
import NewAddress from "../components/account/NewAddress";
import EditAddress from "../components/account/EditAddress";
import MyOrder from "../components/account/AccountOrder";
import Review from "../views/Review";
import AppHeader from "../components/common/header/AppHeader";
import AppFooter from "../components/common/footer/AppFooter";

function Account(){
    const location = useLocation()
    const [state,dispatch] = useContext(Context)
    const { cate } = location.state 
    const [choose, setChoose] = useState(cate)
    const [idfocus, setIdfocus] = useState(0)
    const [idReview, setIdReview] = useState(0)
    const [user, setUser] = useState({})
    const [locate, setLocate] = useState("")
    const navigate = useNavigate()
    const watchDetail=(id) => {
        setIdfocus(id)
        setChoose("order")
    }
    const fetchData = async () =>{
    try{
        var apiuser = await userService.getById(state.loginId)
        setUser(apiuser)
    }
    catch(error){
        console.log(error);
    }
    }
    useEffect(()=>{
        fetchData()
    },[])

    const handlelogout = ()=>{
        dispatch({
          type: "logout",
        })
        notify('success',"Đăng xuất thành công")
        navigate('/')
      }

    function editAddress(locate){
        setLocate(locate)
        setChoose("editaddress")
    }

    return(
        <>
            <AppHeader/>
            <div className="myorder container main">
                <div className="row">
                <div className="col-3">
                    <div className="user-box">
                        <ul className="p-0">
                            <li onClick={() => {setChoose("order"); setIdfocus(0)}}
                                className={(choose==="order" || choose === "review") && "userfocus"}>
                                <span><i class="fa-solid fa-bag-shopping"></i>Đơn hàng</span>
                            </li>
                            <li onClick={() => {setChoose("comment"); setIdfocus(0)}}
                                className={(choose==="comment") && "userfocus"}>
                                <span><i class="fa-solid fa-pen"></i>Bình luận</span>
                            </li>
                            <li onClick={()=>{setChoose("announment"); setIdfocus(0)}}
                                className={choose==="announment" && "userfocus"}>
                                <span><i class="fa-solid fa-bell"></i>Thông báo</span>
                                {state.newNotify.length !== 0 && <span className="newNumber"></span>}
                            </li>
                            <li onClick={()=>setChoose("info")}
                                className={choose==="info" && "userfocus"}>
                                <span><i class="fa-solid fa-info"></i>Thông tin tài khoản</span></li>
                            <li onClick={()=>{setChoose("address"); setIdfocus(0)}}
                                className={(choose==="address" || choose === "newaddress" || choose === "editaddress") && "userfocus"}>
                                <span><i class="fa-solid fa-location-dot"></i>Sổ địa chỉ</span>
                            </li>
                            <li onClick={handlelogout}><span><i class="fa-solid fa-right-from-bracket"></i>Đăng xuất</span></li>
                        </ul>
                    </div>
                </div>
                {
                    choose === "order" && <MyOrder idfocus={idfocus} setIdReview={setIdReview} setChoose={setChoose}/>
                }
                {
                    choose === "announment" && <Announment setChoose={watchDetail}/>
                }
                {
                    choose === "info" && <AccountInfo user={user} fetchData = {fetchData}/>
                }
                {
                    choose === "review" && <Review idReview={idReview}/>
                }
                {
                    choose === "address" && <AccountAddress setChoose={setChoose} user = {user} editAddress={editAddress}/>
                }
                {
                    choose === "newaddress" && <NewAddress setChoose={setChoose}  user={user}/>
                }
                {
                    choose === "editaddress" && <EditAddress setChoose={setChoose}  user={user} locate={locate}/>
                }
                {
                    choose === "comment" && <AccountComment/>
                }
                </div>
            </div>
            <AppFooter/>
        </>
    )
}
export default Account
