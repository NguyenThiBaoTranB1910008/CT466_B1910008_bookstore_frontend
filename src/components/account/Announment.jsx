import { useState, useEffect, useRef } from "react"
import announceService from "../../services/announce.service"
import { useContext } from "react"
import Context from "../../store/Context"

function Announment ({setChoose}){
    const [state,dispatch] = useContext(Context)
    const [announments, setAnnounment] = useState([])
    const nonseen = useRef(state.newNotify)
    useEffect(()=>{
        const fetchOrder = async() =>{
            try{
                const apiannounce = await announceService.get(state.loginAccount)
                setAnnounment(apiannounce)
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder()
    },[])

    useEffect(()=>{
        return async() => {
            const seen = async() =>{
                try{
                    await announceService.seen({accname: localStorage.getItem('user')})
                }
                catch(error){
                    console.log(error);
                }
            }
            seen()
            dispatch({
                type: "seen"
            })
        }
    },[])
    return(
        <>
        <div className="col-9 announment">
               {
                    announments.map((announment, index)=>(
                        <div className={nonseen.current.includes(announment.id) ? "order-item row focus" : "order-item row"}>
                            <div className="announment-info order-info col-9">
                                <div className="">{announment.content}
                                </div>
                                <div className="time">
                                    <i class="fa-regular fa-clock"></i>
                                        {announment.date}
                                </div>
                            </div>
                             <div className="col-3 pt-3" onClick={()=>setChoose(announment.idOrder)}><b>Chi tiết đơn hàng</b></div>
                        </div>
                        // </div>
                        
                    ))
                }
                    {/* </div> */}
            </div>
        </>
    )
}

export default Announment