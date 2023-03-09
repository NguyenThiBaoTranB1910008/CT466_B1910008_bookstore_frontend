import orderService from "../../services/order.service"
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notify, currencyFormat } from '../../auth.action.js';
import announceService from "../../services/announce.service";
import moment from 'moment'

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
                setOrders(apiorder)
                apiorder.map(async(order) =>{
                    newOrderDetail = {...orderdetails}
                    const apidetail = await orderService.getDetail(order.id)
                    newOrderDetail[order.id] = apidetail
                    setOrderDetail(newOrderDetail)
                })
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder()
    },[filter])

    const openDetail = (id) =>{
        var detail = document.getElementsByClassName(`${id}`)
        if(detail[0].classList.contains('none')){
            detail[0].classList.remove('none')
            detail[0].style.maxHeight = '500px'
        }else{
            detail[0].classList.add('none')
            detail[0].style.maxHeight = '0'
        }
    }

    const confirm = (id, accname) =>{
        var announment = {
            date: moment().format("DD/MM/YYYY, h:mm:ss a"),
            user : accname,
            content: "Đơn hàng đã được xác nhận và đang trên đường giao đến bạn.",
            idOrder: id
        }
        
        var a ={
            id: id,
            type: "process"
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

    const deleteOrder = (id, accname) => {
        var announment = {
            date: moment().format("DD/MM/YYYY, h:mm:ss a"),
            user : accname,
            content: "Xin lỗi, đơn hàng không thành công.",
            idOrder: id
        }

        const confirmOrder = async() =>{
            try{
                notify("success", "Đơn hàng đã được hủy bỏ")
                await orderService.confirm({ id: id, type: "cancel"})
                await announceService.create(announment)
                setFilter({...filter, changeData: !filter.changeData})
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
                        // <div className="">
                        <div className="order-item row">
                            <div className="row order-info">
                                <div className="col-1">{index+1}</div>
                                <div className="col-1">{order.accname}</div>
                                <div className="col-2">{order.address}</div>
                                <div className="col-2">{order.dayOrder}</div>
                                <div className="col-2">{order.note}</div>
                                <div className="col-2 order-status">{status[order.status]}</div>
                                <div className='col-2'>
                                    <div className='action-buttons d-flex justify-content-end'>
                                        {order.status === "wait" &&
                                        <div className="order-confirm">
                                            <div className='admin-add-button mx-2'
                                                onClick={()=>confirm(order.id, order.accname)}>
                                                <i class="fa-solid fa-check"></i>
                                            </div>
                                            <div
                                            className='admin-delete-button' onClick={() => deleteOrder(order.id, order.accname)}>
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
                            <div className={"order-detail-all none " + ` ${order.id}`}>
                                {   
                                    (!orderdetails[order.id]) ? "" :
                                    orderdetails[order.id].map((detail)=>(
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
                                            <div className="col-2"><span className="order-detail-quality">x{detail.quality}</span></div> 
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