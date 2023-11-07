function CommentContent({listCmt}){
    console.log(listCmt)
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
                                    cmt.img1 === "" ? "" : <img src={cmt.img1} alt="" />
                                }
                                {
                                    cmt.img2 === "" ? "" : <img src={cmt.img2} alt="" />
                                }
                                {
                                    cmt.img3 === "" ? "" : <img src={cmt.img3} alt="" />
                                }
                                {
                                    cmt.img4 === "" ? "" : <img src={cmt.img4} alt="" />
                                }
                            </div>   
                    </div>
            ))}
        </>
    )
}

export default CommentContent