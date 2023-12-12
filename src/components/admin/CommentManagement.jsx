import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommentService from '../../services/comment.service.js';
import { notify } from '../../auth.action.js';
import ModalDeleteComment from '../common/ModalDeleteComment.jsx';

function CommentManagement(){
    const [comments, setComments]= useState([])
    const [active, setActive] = useState()
    const [activeModal, setActiveModal] = useState(false)
    async function fetchData(){
        try{
            const apicomment = await CommentService.getAll()
            setComments(apicomment)
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchData()
    },[])


    // const adminsearch = ()=>{
    //     const search = document.getElementById('admin-input').value
    //     setFilter({search: search})
    // }

    const handleDelete = async () =>{
        try{
            await CommentService.delete(activeModal.id)
            setActiveModal(false)
            notify("success", "Xóa bình luận thành công")
            fetchData()

        }
        catch(error){
            console.log(error);
        }
    }


    return(
        <div className="user-overview ">
            {activeModal.active && <ModalDeleteComment disagree= {setActiveModal} agree={handleDelete}/>}
            <div className="admin-search">
                <h1 className='admin-action '>Bình luận</h1>
            </div>
            <div className='admin-book table-borderless'>
                    <div className='header-cart-item row header-order'>
                        <div className="col-1">Tên tài khoản</div>
                        <div className="col-2">Sản phẩm</div>
                        <div className="col-3">Nội dung bình luận</div>
                        <div className="col-1">Điểm</div>
                        <div className="col-2">Ngày bình luận</div>
                        <div className="col-2">Hình ảnh</div>
                        <div className="col-1"></div>
                    </div>
                    <div>
                    { comments.map((comment, index) => (
                        <div key={index} className="order-item row py-3">
                            <div className='col-1'>
                                {comment.user_comment.accname}                            
                            </div>
                            <div className='col-2'>
                                <span className='admin-book-price mr-2'>
                                    {comment.product_comment.title}
                                 </span>
                            </div> 
                            <div className='col-3'>
                                {comment.comment}
                            </div>
                            <div className="col-1">
                                <div className="cus-ratting pb-2" >
                                    <div className="ratting-star">
                                        <div className="ratting" style={{width: comment.ratting/0.05 + '%'}}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-2'>
                                {comment.dateCmt}
                            </div>
                            <div className="cus-comment col-2">
                                    {
                                        comment.img1 === "" ? "" : <img src={comment.img1} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + comment.id} onClick={()=>setActive(1)}/>
                                    }
                                    {
                                        comment.img2 === "" ? "" : <img src={comment.img2} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + comment.id} onClick={()=>setActive(2)}/>
                                    }
                                    {
                                        comment.img3 === "" ? "" : <img src={comment.img3} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + comment.id} onClick={()=>setActive(3)}/>
                                    }
                                    {
                                        comment.img4 === "" ? "" : <img src={comment.img4} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + comment.id} onClick={()=>setActive(4)}/>
                                    }
                            </div>
                            <div class="modal fade" id={"staticBackdrop" + comment.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <button type="button" class="btn-close show-img" data-bs-dismiss="modal" aria-label="Close"></button>
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-body center" >
                                        <div id={"carouselExampleControls" + comment.id} className="carousel slide">
                                            <div className="carousel-inner">
                                            {
                                                comment.img1 === "" ? "" : 
                                                <div className={active == 1 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={comment.img1} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            {
                                                comment.img2 === "" ? "" : 
                                                <div className={active == 2 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={comment.img2} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            {
                                                comment.img3 === "" ? "" : 
                                                <div className={active == 3 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={comment.img3} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            {
                                                comment.img4 === "" ? "" : 
                                                <div className={active == 4 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={comment.img4} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>        
                                <button className="carousel-control-prev  carousel-control-prev-next-icon" type="button" data-bs-target={"#carouselExampleControls" + comment.id} data-bs-slide="prev">
                                    <i className="fa-solid fa-chevron-left carousel-control-icon"></i>
                                </button>
                                <button className="carousel-control-next  carousel-control-prev-next-icon" type="button" data-bs-target={"#carouselExampleControls" + comment.id} data-bs-slide="next">
                                    <i className="fa-solid fa-chevron-right carousel-control-icon"></i>
                                </button>
                            </div>  
                            <div className='col-1'>
                                    <div className='action-buttons d-flex justify-content-end'>
                                            <div
                                                onClick={() => setActiveModal({
                                                    active: true,
                                                    id: comment.id})
                                                }
                                            className='admin-delete-button'>
                                                <i className='fas fa-trash'></i>
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

export default CommentManagement