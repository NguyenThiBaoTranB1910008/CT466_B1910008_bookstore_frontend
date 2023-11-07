import { useContext, useState, useEffect, useRef} from 'react';
import Context from '../../store/Context';
import commentService from '../../services/comment.service';
import CommentContent from './CommentContent';
import Axios from 'axios';
import { notify } from '../../auth.action.js';

function Comment({id, reload}){
    const [state,dispatch] = useContext(Context)
    const [listCmt,setListCmt] = useState([])
    const [listImgCmt,setListImgCmt] = useState([])
    const rattingNumber = useRef(1)
    const rattingTotal = useRef(1)
    const [listFile, setListFile] = useState([])
    const [listStart, setListStart] = useState([])
        
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
    
    const getRatting = () =>{
        var sum = 0
        var list = [0,0,0,0,0]
        for (var i = 0 ; i < listCmt.length ; i++){
            sum += listCmt[i].ratting
            list[listCmt[i].ratting-1] += 1
        }
        setListStart(list)
        return  (sum/listCmt.length).toFixed(1)
    }


    const fetchData = async () => {
        try {
            const apiCmt = await commentService.get(id);
            setListCmt(apiCmt)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        rattingTotal.current = getRatting()
    },[listCmt])

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

    useEffect(() => {
        fetchData()
    },[]);

    const saveComment = async () =>{
        var cmt = document.getElementById('txtid').value
        document.getElementById('txtid').setAttribute("value","")
        const comment = {
            idBook: id,
            idUser:state.loginId,
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
            notify("success", "Cảm ơn bạn đã đóng góp những nhận xét quý báo về quyển sách.")
        } catch (error) {
            console.log(error);
        }
        uploadFile()
        fetchData()
        reload()
    }

    return(
        <>
            <div className="detail-comment">
                <h2 className="title">Đánh giá sản phẩm</h2>
                {
                    listCmt.length == 0 ?
                    <div className="non-comment center">
                        <img src="http://localhost:3000/cute-book-cartoon-isolated-icon-cute-book-cartoon-225593557-removebg-preview.png" alt="" />
                        <div>Chưa có đánh giá nào cho sản phẩm này</div>
                    </div> :
                    <div className="product-tab-chart">
                        <div className="col-4 product-tab-chart-left">
                            <div className="product-point">
                                {rattingTotal.current}
                                <span className="max-point">/5</span>
                            </div>
                            <div className="ratting-star">
                                <div className="ratting" style={{width: rattingTotal.current/0.05 + '%'}}>
                                </div>
                            </div>
                            <div className="sum-comment">
                                ({listCmt.length} đánh giá)
                            </div>
                        </div> 
                        <div className="col-8">
                            <div className="star-number row center">
                                <div className="ratting-star col-2">
                                    <div className="ratting" style={{width: '100%'}}>
                                    </div>
                                </div>
                                <div className="star-process col-6">
                                    <div className="process" style={{width: `${listStart[4]/listCmt.length*100}%`}}></div>
                                </div>
                                <div className="ratting-percent col-2">
                                    {(listStart[4]/listCmt.length*100).toFixed(1)}%  
                                </div>
                            </div>
                            <div className="star-number row center">
                                <div className="ratting-star col-2">
                                <div className="ratting" style={{width: '80%'}}></div>
                                </div>
                                <div className="star-process col-6">
                                    <div className="process" style={{width: `${listStart[3]/listCmt.length*100}%`}}></div>
                                </div>
                                <div className="ratting-percent col-2">
                                    {(listStart[3]/listCmt.length*100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="star-number row center">
                                <div className="ratting-star col-2">
                                    <div className="ratting" style={{width: '60%'}}></div>
                                </div>
                                <div className="star-process col-6">
                                    <div className="process" style={{width: `${listStart[2]/listCmt.length*100}%`}}></div>
                                </div>
                                <div className="ratting-percent col-2">
                                    {(listStart[2]/listCmt.length*100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="star-number row center">
                                <div className="ratting-star col-2">
                                    <div className="ratting" style={{width: '40%'}}></div>
                                </div>
                                <div className="star-process col-6">
                                    <div className="process" style={{width: `${listStart[1]/listCmt.length*100}%`}}></div>
                                </div>
                                <div className="ratting-percent col-2">
                                    {(listStart[1]/listCmt.length*100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="star-number row center">
                                <div className="ratting-star col-2">
                                    <div className="ratting" style={{width: '20%'}}></div>
                                </div>
                                <div className="star-process col-6">
                                    <div className="process" style={{width: `${listStart[0]/listCmt.length*100}%`}}></div>
                                </div>
                                <div className="ratting-percent col-2">
                                    {(listStart[0]/listCmt.length*100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                }
                    <div className="comment-main">
                    {
                        <CommentContent listCmt={listCmt}/>
                    }
                    </div>
                    <div className="write-cmt">
                    <button className="boxsale-button-cart write-comment">
                        <i class="fa-solid fa-pen"></i>
                            <span className="mx-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Viết đánh giá</span>
                        </button>
                    </div>
                    {/* <!-- Modal --> */}
                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">Đánh giá sản phẩm</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        <div class="modal-body center">
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
                                        <div className="detail-boximg ">
                                            <div className="detail-img">
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
                                    <div className="detail-boximg ">
                                    <div className="detail-img">
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
                            <button type="commit" class="write-comment" onClick={()=>saveComment()} data-bs-dismiss="modal">Gửi nhận xét</button>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
        </>
    )
}

export default Comment;
