import { useEffect, useState, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Context from "../store/Context";
import userService from "../services/user.service";
import announceService from "../services/announce.service";
import { notify } from "../auth.action"
import AccountInfo from "../components/account/AccountInfo"
import Announment from "../components/account/Announment";
import MyOrder from "../components/account/AccountOrder";
import AppHeader from "../components/common/header/AppHeader";
import AppFooter from "../components/common/footer/AppFooter";

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
                const apiannounce = await announceService.get(state.loginAccount)
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
        notify('success',"????ng xu???t th??nh c??ng")
        navigate('/')
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
                                className={choose==="order" && "userfocus"}>
                                <span><i class="fa-solid fa-bag-shopping"></i>????n h??ng</span>
                            </li>
                            <li onClick={()=>{setChoose("announment"); setIdfocus(0)}}
                                className={choose==="announment" && "userfocus"}>
                                <span><i class="fa-solid fa-bell"></i>Th??ng b??o</span>
                                {state.newNotify.length !== 0 && <span className="newNumber"></span>}
                            </li>
                            <li onClick={()=>setChoose("info")}
                                className={choose==="info" && "userfocus"}>
                                <span><i class="fa-solid fa-info"></i>Th??ng tin t??i kho???n</span></li>
                            <li onClick={handlelogout}><span><i class="fa-solid fa-right-from-bracket"></i>????ng xu???t</span></li>
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
            <AppFooter/>
        </>
    )
}
export default Account