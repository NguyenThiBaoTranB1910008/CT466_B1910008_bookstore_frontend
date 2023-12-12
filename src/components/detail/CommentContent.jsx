import { useState} from 'react';
function CommentContent({listCmt}){
    const [active, setActive] = useState()
    return(
        <>
            {
                listCmt.map((cmt, index)=>( 
                    <div className="comment pt-3">
                            <div className="cus-name col-3">
                            <div>{ cmt.user_comment.fullname}</div>
                            <div className="comment-date">{cmt.dateCmt}</div>
                            <div className="sold ">
                                <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/verify.svg" className="sold-img" alt="" />
                                    <span>Đã mua hàng</span>
                                </div>
                            </div>
                            <div className="cus-comment col-9">
                                <div className="cus-ratting pb-2" >
                                    <div className="ratting-star">
                                        <div className="ratting" style={{width: cmt.ratting/0.05 + '%'}}>
                                        </div>
                                    </div>
                                </div>
                                <p>
                                {
                                    cmt.comment
                                }
                                </p>
                                {
                                    cmt.img1 === "" ? "" : <img src={cmt.img1} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + cmt.id} onClick={()=>setActive(1)}/>
                                }
                                {
                                    cmt.img2 === "" ? "" : <img src={cmt.img2} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + cmt.id} onClick={()=>setActive(2)}/>
                                }
                                {
                                    cmt.img3 === "" ? "" : <img src={cmt.img3} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + cmt.id} onClick={()=>setActive(3)}/>
                                }
                                {
                                    cmt.img4 === "" ? "" : <img src={cmt.img4} alt="" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + cmt.id} onClick={()=>setActive(4)}/>
                                }
                            </div>   
                            <div class="modal fade" id={"staticBackdrop" + cmt.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <button type="button" class="btn-close show-img" data-bs-dismiss="modal" aria-label="Close"></button>
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-body center" >
                                        <div id={"carouselExampleControls" + cmt.id} className="carousel slide">
                                            <div className="carousel-inner">
                                            {
                                                cmt.img1 === "" ? "" : 
                                                <div className={active == 1 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={cmt.img1} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            {
                                                cmt.img2 === "" ? "" : 
                                                <div className={active == 2 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={cmt.img2} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            {
                                                cmt.img3 === "" ? "" : 
                                                <div className={active == 3 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={cmt.img3} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            {
                                                cmt.img4 === "" ? "" : 
                                                <div className={active == 4 ? "carousel-item active" : "carousel-item"}>
                                                    <img src={cmt.img4} alt="" className="d-block w-100" />
                                                </div>
                                            }
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>        
                                <button className="carousel-control-prev  carousel-control-prev-next-icon" type="button" data-bs-target={"#carouselExampleControls" + cmt.id} data-bs-slide="prev">
                                    <i className="fa-solid fa-chevron-left carousel-control-icon"></i>
                                </button>
                                <button className="carousel-control-next  carousel-control-prev-next-icon" type="button" data-bs-target={"#carouselExampleControls" + cmt.id} data-bs-slide="next">
                                    <i className="fa-solid fa-chevron-right carousel-control-icon"></i>
                                </button>
                            </div>
                    </div>
            ))}
        </>
    )
}

export default CommentContent