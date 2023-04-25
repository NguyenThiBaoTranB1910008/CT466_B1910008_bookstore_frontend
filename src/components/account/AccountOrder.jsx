import { useEffect, useState } from "react"
import orderService from "../../services/order.service"
import { currencyFormat, notify } from "../../auth.action"
import EmptyCart from "../cart/EmptyCart"


function MyOrder({idfocus}){
    const [orders, setOrder] = useState([])
    const [orderdetails, setOrderDetail] = useState({})
    const [filter, setFilter] = useState({changeData: false, id: localStorage.getItem('user')})
    const status ={
        wait: "Chờ xác nhận",
        process:"Đang giao",
        shipped: "Hoàn thành",
        cancel: "Đã hủy"
    }

    useEffect(()=>{
        const fetchOrder = async() =>{
            try{
                const apiorder = await orderService.getByFilter(filter)
                for(var i=0; i< apiorder.length; i++){
                        const apidetail = await orderService.getDetail(apiorder[i].id)
                        apiorder[i].detail = apidetail
                }
                setOrder(apiorder)
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder()
    },[filter])
    
    const openDetail = (id) =>{
        var detail = document.getElementsByClassName(`${id}`)
        if(detail[0].style.maxHeight==='0px'){
            detail[0].style.maxHeight = '500px'
        }else{
            detail[0].style.maxHeight = '0'
        }
    }

    const shipped = (id) =>{
        const confirmOrder = async() =>{
            try{
                await orderService.confirm({id:id, type: "shipped"})
                setFilter({...filter, changeData: !filter.changeData})
                notify("success", "Đơn hàng đã hoàn thành")
            }
            catch(error){
                console.log(error);
            }
        }
        confirmOrder()
    }

    const cancel = (id) =>{
        const confirmOrder = async() =>{
            try{
                await orderService.confirm({id:id, type: "cancel"})
                setFilter({...filter, changeData: !filter.changeData})
                notify("success", "Đơn hàng đã được hủy")
            }
            catch(error){
                console.log(error);
            }
        }
        confirmOrder()
    }

    // const handleFilter = (e) =>{
    //     console.log(e.target.value)
    //     etFilter({...filter, status: fil.value})
        
        
    // }
    
    return(
        <>  
            <div className="col-9">
                <div className="row mb-3">
                    <div className="col-3 p-0">
                    <select class="form-select" name="country" id="order-filter" onChange={(e)=>setFilter({...filter, status: e.target.value})}>
                        <option value="" >Tất cả</option>
                        <option value="wait" >Chờ xác nhận</option>
                        <option value="process">Đang giao</option>
                        <option value="shipped">Hoàn thành</option>
                        <option value="cancel">Đã hủy</option>
                    </select> 
                    </div>
                </div>
                <div className="header-cart-item row header-order">
                    <div className="col-1">id</div>
                    <div className="col-1">Tên</div>
                    <div className="col-3">Địa chỉ nhận hàng</div>
                    <div className="col-2">Ngày đặt hàng</div>
                    <div className="col-2">Ghi chú</div>
                    <div className="col-2">Trạng thái</div>
                    <div className="col-1">Chi tiết</div>
                </div>
                {
                    (orders.length === 0 && filter.status === "") ? <EmptyCart imgUrl="https://www.gramedia.com/assets/illustrations/empty-order.png"
                                                    title = "Bạn chưa có đơn hàng nào cả"/> :
                    orders.map((order, index)=>(
                        // <div className="">
                        <div className={(idfocus!==0 && idfocus===order.id) ? "order-item row focus" : "order-item row"}>
                            <div className="row order-info">
                                <div className="col-1">{index+1}</div>
                                <div className="col-1">{order.firstname}</div>
                                <div className="col-3">{order.address}</div>
                                <div className="col-2">{order.dayOrder}</div>
                                <div className="col-2">{order.note}</div>
                                <div className="col-2"> {status[order.status]}
                                    {
                                        order.status === "process" &&
                                        <div className="admin-edit-button mt-2"
                                        onClick={() => shipped(order.id)}>Đã nhận
                                        </div> 
                                    }
                                    {
                                        order.status === "wait" &&
                                        <div className="admin-delete-button mt-2"
                                        onClick={() => cancel(order.id)}>Hủy đơn
                                        </div> 
                                    }</div>
                                <div className="col-1 order-item-icon"><i class="fa-solid fa-angles-down" onClick={()=>openDetail(order.id)}></i></div>
                            </div>
                            <div className={"order-detail-all " + ` ${order.id}`} style={{'max-height':'0px'}}>
                                {   
                                    // (!orderdetails[order.id]) ? "" :
                                    order.detail.map((detail)=>(
                                        <div className="order-detail row p-1">
                                            {/* <div className="col-1"></div> */}
                                            <div className="order-detail-img col-2">
                                                <img src={detail.imgUrl} alt="" />
                                            </div>
                                            <div className="order-detail-name-quality col-5">
                                                <div className="order-detail-name">
                                                    {detail.title}
                                                </div>
                                            </div>
                                            <div className="col-2"><span className="order-detail-quality">x{detail.quantity}</span></div> 
                                            <div className="order-detail-price col-2">
                                                {currencyFormat(detail.price)}
                                            </div>
                                        </div>
                                    ))
                                }
                                <div className="order-detail-total">
                                    <span>Tổng đơn hàng:</span>
                                    <span className="px-2">{currencyFormat(order.total)}</span>
                                </div>
                                </div>
                            </div>
                        // </div>
                        
                    ))
                }
                    {/* </div> */}
            </div>
        </>
    )
}
export default MyOrder