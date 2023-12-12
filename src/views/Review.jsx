import React, { useState, useEffect,useContext, useRef } from "react";
import orderService from "../services/order.service"
import { currencyFormat } from '../auth.action';
import Context from '../store/Context';
import commentService from '../services/comment.service';
import Axios from 'axios';
import { notify } from '../auth.action'

function Review({idReview}){
    const [state,dispatch] = useContext(Context)
    const [listImgCmt,setListImgCmt] = useState([])
    const rattingNumber = useRef(1)
    const [listFile, setListFile] = useState([])
        
    const ratting = (number) =>{
        const start = document.getElementsByClassName('ratting-item')
        if(start[number-1].getAttribute('src') === 'https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_yellow.svg'){
            for(var i = 4  ; i >= number ; i--){
                start[i].setAttribute('src', 'https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_gray.svg')
            }
        }
        else{     
            for(var i = 0  ; i < number ;i++){
                start[i].setAttribute('src', 'https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_yellow.svg')
            }
        }
        rattingNumber.current = number
    }

    const deleteImgUpload = (id) => {
        var list = [...listImgCmt]
        list.splice(id, 1)
        setListImgCmt(list)
    };

    const uploadImage= async (formData, config) =>{
        try{
            Axios.post('http://localhost:3001/api/comment/upload', formData, config)
            .then(response => {
                    if (response.data.success) {
                    } else {
                        alert('Failed to save the Image in Server')
                    }
                })
            }
            catch(error){
                console.log(error);
            }
        }
    
    const uploadFile = () =>{
        let formData = new FormData();
        if(listFile[0])
            formData.append("photo1", listFile[0]);
        if(listFile[1])
            formData.append("photo2", listFile[1]);
        if(listFile[2])
            formData.append("photo3", listFile[2]);
        if(listFile[3])
            formData.append("photo4", listFile[3]);
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        uploadImage(formData,config)
    }

    const saveComment = async (id) =>{
        var cmt = document.getElementById('txtid').value
        document.getElementById('txtid').setAttribute("value","")
        const comment = {
            idBook: id,
            idUser: parseInt(state.loginId),
            ratting: rattingNumber.current,
            comment: cmt,
            dateCmt: new Date().toISOString().slice(0, 10).replace(/-/g,'/'),
            img1: listFile[0] ? `http://localhost:3001/comments/${listFile[0].name}` : "",
            img2: listFile[1] ? `http://localhost:3001/comments/${listFile[1].name}` : "",
            img3: listFile[2] ? `http://localhost:3001/comments/${listFile[2].name}` : "",
            img4: listFile[3] ? `http://localhost:3001/comments/${listFile[3].name}` : "",
        }
        try {
            await commentService.create(comment)
            await orderService.reviewBook({idOrder: idReview, idBook: id})
        } catch (error) {
            console.log(error);
        }
        uploadFile()
        notify("success", "Cảm ơn bạn đã đánh giá.")
        fetchOrder()
        // reload()
    }
    const [orders, setOrder] = useState([])
    const fetchOrder = async() =>{
        try{
            const apiorder = await orderService.getOrderById(idReview)
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
    
    useEffect(()=>{
        fetchOrder()
    },[])

    return(
        <>
        {   orders.length === 0 ? "" : 
        <div className="col-9 review">
            <div className="order-address">
                <h3 className="title">Địa chỉ nhận hàng</h3>
                <p>
                    <p>
                    <span>{orders[0].order_address.name} </span>
                    </p>
                    <p>{orders[0].order_address.phone}</p>
                    <p>
                        {orders[0].order_address.address + ", " + orders[0].order_address.ward + ", " + orders[0].order_address.district + ", " + orders[0].order_address.city}
                    </p>
                </p>
            </div>
            <br />
            <div className="order-address">
            <h3 className="title">Thông tin đơn hàng</h3>
                <div className=" container">
                    <div className="row">
                        <span className="col-8">Mã đơn hàng:</span>
                        <span className="col-4 right">{orders[0].id}</span>
                    </div>
                    <div className="row">
                        <span className="col-8">Thời gian đặt hàng:</span>
                        <span className="col-4 right">{orders[0].dayOrder}</span>
                    </div>
                    <div className="row">
                        <span className="col-8">Thời gian giao hàng:</span>
                        <span className="col-4 right">{orders[0].dayConfirm}</span>
                    </div>
                    <div className="row">
                        <span className="col-8">Thời gian nhận hàng:</span>
                        <span className="col-4 right">{orders[0].dayReceipt}</span>
                    </div>
                    </div>
                </div>
                <br />
                <div className="order-address container">
                    <h3 className="title">Sản phẩm</h3>
                    {orders[0].detail.map((detail, index)=>(
                        <div className="cart-item row order-detail-item">
                            <div className="cart-item-img">
                                <img src={detail.imgUrl} alt="" />
                            </div>
                            <div className="cart-item-name-price">
                                <div className="cart-item-name">
                                    {detail.title}
                                </div>
                                <p style={{margin:0}}>x {detail.quantity}</p>
                                <span className="beween">
                                    <span> 
                                        <p className="cart-item-price">{currencyFormat(detail.price)}</p>
                                    </span>
                                    {
                                        orders[0].status == "shipped" ? 
                                        <>
                                            {
                                            detail.review === 0 ?
                                            <button className="boxsale-button-cart write-comment">
                                            <i class="fa-solid fa-pen"></i>
                                                <span className="mx-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Viết đánh giá</span>
                                            </button>
                                            : <span className="review-done login-text">Đã đánh giá</span>
                                            }
                                        </> : ""
                                    }
                                </span>
                            </div>
                            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">Đánh giá sản phẩm</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        <div class="modal-body center">
                            <div className="cart-item row order-detail-item review-mini">
                                <div className="cart-item-img">
                                    <img src={detail.imgUrl} alt="" />
                                </div>
                            <div className="cart-item-name-price">
                                <div className="cart-item-name">
                                    {detail.title}
                                </div>
                                <span className="beween">
                                    <span> 
                                        <p className="cart-item-price">{currencyFormat(detail.price)}</p>
                                        </span>
                                </span>
                            </div> 
                            </div>
                            <br />
                            <div className="ratting-star comment">
                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_yellow.svg" className="ratting-item ratting-item-1" onMouseEnter={()=> ratting(1)}/>
                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_gray.svg" className="ratting-item ratting-item-2" onMouseEnter={()=> ratting(2)}/>
                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_gray.svg" className="ratting-item ratting-item-3" onMouseEnter={()=> ratting(3)}/>
                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_gray.svg" className="ratting-item ratting-item-4" onMouseEnter={()=> ratting(4)}/>
                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/ico_star_gray.svg" className="ratting-item ratting-item-5" onMouseEnter={()=> ratting(5)}/>
                            </div>
                            <div className="comment-upload center">
                                {
                                    listImgCmt.map((img, index)=>(
                                        <div className="review-boximg mt-2">
                                            <div className="review-img">
                                                <img src={img} className='uploadimg' /> 
                                                <span className='cancel-upload' onClick={()=>deleteImgUpload(index)}>
                                                    <i class="fa-solid fa-x"></i>
                                                </span>    
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    listImgCmt.length < 4 && 
                                    <div className="review-comment">
                                    <div className="review-boximg">
                                        <i class="fa-solid fa-camera"></i>
                                            <input className="uploadfile" name="imageUrl" id="image-file" style={{opacity:0}} 
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => {
                                                    setListImgCmt([
                                                        ...listImgCmt,
                                                        URL.createObjectURL(event.target.files[0])
                                                    ])
                                                    setListFile([...listFile, event.target.files[0]])
                                                }}
                                        />
                                    </div>
                                </div>
                                }
                            </div>
                                <div className="comment-nd">
                                    <textarea id="txtid" name="txtname" rows="6" cols="50" maxlength="500"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn" data-bs-dismiss="modal">Hủy</button>
                                <button type="commit" class="write-comment" onClick={()=>saveComment(detail.idBook)} data-bs-dismiss="modal">Gửi nhận xét</button>
                            </div>
                            </div>
                            </div>
                    </div>
                    </div>
                    ))}
                    <div className=" container mt-2">
                    <div className="row">
                        <span className="col-8">Tổng tiền hàng:</span>
                        <span className="col-4 right"><b>{currencyFormat(orders[0].totalItems)}</b></span>
                    </div>
                    <div className="row">
                        <span className="col-8">Phí ship:</span>
                        <span className="col-4 right"><b>{currencyFormat(orders[0].total - orders[0].totalItems)}</b></span>
                    </div>
                    <div className="row">
                        <span className="col-8">Tổng đơn hàng:</span>
                        <span className="col-4 right"><b>{currencyFormat(orders[0].total)}</b></span>
                    </div>
                    </div>
                    
            </div>
            </div>
        }
        </>
    )
}

export default Review