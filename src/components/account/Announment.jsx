import { useState, useEffect } from "react"
import announceService from "../../services/announce.service"
import { useContext } from "react"
import reducer from "../../store/reducer"
import Context from "../../store/Context"


function Announment ({setChoose, announments, nonseen}){
    const [state,dispatch] = useContext(Context)
    // const [announments, setAnnounment] = useState([])
    // const [nonseenList, setNonseen] = useState([])
    // setNonseen(nonseen)
     useEffect(()=>{
        const fetchOrder = async() =>{
            try{
                await announceService.seen({accname: localStorage.getItem('user')})
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder()
        return () => {
                // dispatch({
                //     type: "seen"
                // })
            // console.log("clean up")
        };
        // return async() => {e
        //     const seen = async() =>{
        //         try{
    //     //         }
    //     //         catch(error){
    //     //             console.log(error);
    //     //         }
    //     //     }
    //     //     seen()
    //     // }
    },[])
    return(
        <>
        <div className="col-9 announment">
               {
                    announments.map((announment, index)=>(
                        <div className={nonseen.includes(announment.id) ? "order-item row focus" : "order-item row"}>
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