import { useState } from "react";
function ModalDeleteComment({ disagree, agree}){
    const [modal, setModal] = useState(true)
    const close = ()=>{
        setModal(false)
        disagree(false)
    }

    const deleteItem = (id) =>{
        agree(id)
    }
    return (
        <>
        {modal && 
        <div className="overlay center">
        <div className="appmodal">
            <div className="modal-header">
                <h1 className="title">Bạn chắn chắn xóa bình luận này ?</h1>
                <span onClick={close}><i class="fa-sharp fa-solid fa-xmark"></i></span>
            </div>
            <div className="modal-footer px-5 py-4">
                <div className="app-button" onClick={() => deleteItem()}>Xóa bình luận</div>
                <div className="app-button white" onClick={close}>Hủy</div>
            </div>
        </div>
        </div>
        } 
        </>
    );
}
export default ModalDeleteComment