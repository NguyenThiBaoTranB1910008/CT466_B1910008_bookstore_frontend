import { useEffect, useState } from "react"
import AccountInfo from "./AccountInfo"
import { useLocation } from "react-router-dom"
import userService from "../../services/user.service"
import { useContext } from 'react';
import Context from "../../store/Context"
import { useNavigate } from "react-router-dom";
import { notify } from "../../auth.action"
import Announment from "./Announment";
import MyOrder from "./MyOrder";
import announceService from "../../services/announce.service";

function Account(){
    const location = useLocation()
    const [state,dispatch] = useContext(Context)
    const { cate } = location.state 
    const [choose, setChoose] = useState(cate)
    const [idfocus, setIdfocus] = useState(0)
    const [user, setUser] = useState({})
    const [announments, setAnnounment] = useState([])
    const [nonseen, setNonseen] = useState([])
    const navigate = useNavigate()
    const watchDetail=(id) => {
        setIdfocus(id)
        setChoose("order")
    }

    useEffect(()=>{
        const fetchData = async () =>{
        try{
            var apiuser = await userService.get(state.loginAccount)
            setUser(apiuser)
        }
        catch(error){
            console.log(error);
        }
        }
        fetchData()
    },[])

    useEffect(()=>{
        const fetchOrder = async() =>{
            try{
                console.log(state.loginAccount)
                const apiannounce = await announceService.get(state.loginAccount)
                console.log(apiannounce)
                var seen = []
                apiannounce.map((announment)=>{
                    if(announment.status===0)
                    seen.push(announment.id)
                })
                setNonseen(seen)
                setAnnounment(apiannounce)
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder()
    },[])

    const handlelogout = ()=>{
        dispatch({
          type: "logout",
        })
        notify('success',"Đăng xuất thành công")
        navigate('/')
      }
      
    return(
        <>
            <div className="myorder container main">
                <div className="row">
                <div className="col-3">
                    <div className="user-box">
                        <ul className="p-0">
                            <li onClick={() => {setChoose("order"); setIdfocus(0)}}
                                className={choose==="order" && "userfocus"}>
                                <span><i class="fa-solid fa-bag-shopping"></i>Đơn hàng</span>
                            </li>
                            <li onClick={()=>{setChoose("announment"); setIdfocus(0)}}
                                className={choose==="announment" && "userfocus"}>
                                <span><i class="fa-solid fa-bell"></i>Thông báo</span>
                                {state.newNotify.length !== 0 && <span className="newNumber"></span>}
                            </li>
                            <li onClick={()=>setChoose("info")}
                                className={choose==="info" && "userfocus"}>
                                <span><i class="fa-solid fa-info"></i>Thông tin tài khoản</span></li>
                            <li onClick={handlelogout}><span><i class="fa-solid fa-right-from-bracket"></i>Đăng xuất</span></li>
                        </ul>
                    </div>
                </div>
                {
                    choose === "order" && <MyOrder idfocus={idfocus}/>
                }
                {
                    choose === "announment" && <Announment setChoose={watchDetail} announments={announments} nonseen={state.newNotify}/>
                }
                                {
                    choose === "info" && <AccountInfo user={user}/>
                }
                </div>
            </div>
        </>
    )
}
export default Account