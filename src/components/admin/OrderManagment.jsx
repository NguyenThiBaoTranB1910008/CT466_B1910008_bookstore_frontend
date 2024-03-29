import { useState, useEffect } from 'react';
import moment from 'moment'
import { notify, currencyFormat } from '../../auth.action.js';
import orderService from "../../services/order.service"
import announceService from "../../services/announce.service";
import productService from "../../services/product.service";

function OrderManagment(){
    const[orders, setOrders]= useState([])
    const [orderdetails, setOrderDetail] = useState({})
    const [filter, setFilter] = useState({changeData: false})
    const status = {
        wait : "Chờ xác nhận",
        process : "Đang giao",
        shipped : "Hoàn thành",
        cancel : "Đã hủy"
    }
    useEffect(()=>{
        var newOrderDetail 
        const fetchOrder = async() =>{
            try{
                const apiorder = await orderService.getByFilter(filter)
                for(var i=0; i< apiorder.length; i++){
                        const apidetail = await orderService.getDetail(apiorder[i].id)
                        apiorder[i].detail = apidetail
                }
                setOrders(apiorder)
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

    const confirm = (order) =>{
        var announment = {
            date: moment().format("DD/MM/YYYY, h:mm:ss a"),
            user : order.accname,
            content: `Đơn hàng ( id=${order.id} ) đã được xác nhận và đang trên đường giao đến bạn.`,
            idOrder: order.id
        }
        
        var a ={
            id: order.id,
            type: "process",
            dayConfirm: moment().format("DD/MM/YYYY, h:mm:ss a")
        }

        const confirmOrder = async() =>{
            try{
                notify("success", "Xác nhận đơn hàng thành công")
                await orderService.confirm(a)
                await announceService.create(announment)
                setFilter({...filter, changeData: !filter.changeData})
            }
            catch(error){
                console.log(error);
            }
        }
        confirmOrder()
    }

    const deleteOrder = (order) => {
        var announment = {
            date: moment().format("DD/MM/YYYY, h:mm:ss a"),
            user : order.accname,
            content: "Xin lỗi, hiện tại cửa hàng không thể thực hiện đơn hàng của bạn.",
            idOrder: order.id
        }

        const confirmOrder = async() =>{
            try{
                notify("success", "Đơn hàng đã được hủy bỏ")
                await orderService.confirm({ id: order.id, type: "cancel"})
                await announceService.create(announment)
                setFilter({...filter, changeData: !filter.changeData})
                orderdetails[order.id].map(async(product)=> (
                    await productService.order(product.id, {id: product.idBook, quantity: -product.quantity})
                ))
            }
            catch(error){
                console.log(error);
            }
        }
        confirmOrder()
    }

    const handleFilter = () =>{
        const fil = document.getElementById('order-filter')
        setFilter({...filter, status: fil.value})
    }

    return(
        <>
        <div className="order-overview ">
            <div className="admin-search">
                <h1 className='admin-action '>Đơn hàng</h1>
                <div className="">
                    <div className="pe-4">
                    <select class="form-select" name="country" id="order-filter" onChange={handleFilter}>
                        <option value="" >Tất cả</option>
                        <option value="wait" >Chờ xác nhận</option>
                        <option value="process">Đang giao</option>
                        <option value="shipped">Hoàn thành</option>
                        <option value="cancel">Đã hủy</option>
                    </select>  
                    </div>
                    {/* <div className="admin-add-button mx-2" onClick={handleFilter}>Lọc</div> */}
                </div>
            </div>
            <div className="header-cart-item row header-order mt-3">
                    <div className="col-1">id</div>
                    <div className="col-1">Tài khoản</div>
                    <div className="col-2">Địa chỉ nhận hàng</div>
                    <div className="col-2">Ngày đặt hàng</div>
                    <div className="col-2">Ghi chú</div>
                    <div className="col-2">Trạng thái</div>
                </div>
                {
                    orders.map((order, index)=>(
                        <div className="order-item row">
                            <div className="row order-info">
                                <div className="col-1">{index+1}</div>
                                <div className="col-1">{order.idUser}</div>
                                <div className="col-2">
                                    {order.order_address.address + ", " + order.order_address.ward + ", " + order.order_address.district + ", " + order.order_address.city}
                                </div>
                                <div className="col-2">{order.dayOrder}</div>
                                <div className="col-2">{order.note}</div>
                                <div className="col-2 order-status">{status[order.status]}</div>
                                <div className='col-2'>
                                    <div className='action-buttons d-flex justify-content-end'>
                                        {order.status === "wait" &&
                                        <div className="order-confirm">
                                            <div className='admin-add-button mx-2'
                                                onClick={()=>confirm(order)}>
                                                <i class="fa-solid fa-check"></i>
                                            </div>
                                            <div
                                            className='admin-delete-button' onClick={() => deleteOrder(order)}>
                                                <i className='fas fa-trash'></i>
                                            </div>
                                        </div>}
                                            <div onClick={()=>openDetail(order.id)}
                                                className='admin-edit-button mx-2'>
                                                    <i class="fa-solid fa-angles-down"></i>
                                                </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"order-detail-all" + ` ${order.id}`} style={{'max-height':'0px'}}> 
                                {   
                                    // (!orderdetails[order.id]) ? "" :
                                    order.detail.map((detail)=>(
                                        <div className="order-detail row p-1">
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
                    </div>
                {/* </div> */}
        </>
    )
}

export default OrderManagment