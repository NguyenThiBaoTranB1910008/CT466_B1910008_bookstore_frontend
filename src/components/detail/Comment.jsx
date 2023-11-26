import { useContext, useState, useEffect, useRef} from 'react';
import Context from '../../store/Context';
import commentService from '../../services/comment.service';
import CommentContent from './CommentContent';
import Axios from 'axios';
import { notify } from '../../auth.action.js';

function Comment({id, reload}){
    const [listCmt,setListCmt] = useState([])
    const rattingTotal = useRef(1)
    const [listStart, setListStart] = useState([])
    
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

    useEffect(() => {
        fetchData()
    },[]);

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
            </div>
        </>
    )
}

export default Comment;
