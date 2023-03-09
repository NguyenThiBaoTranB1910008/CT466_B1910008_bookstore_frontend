import { useState } from "react";
function Modal({item, disagree, agree}){
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
                <h1 className="title">Bạn chắn chắn xóa sản phẩm này ?</h1>
                <span onClick={close}><i class="fa-sharp fa-solid fa-xmark"></i></span>
            </div>
            <div className="modal-body px-5 row">
                <div className="col-2">
                <img src={item.imageUrl || item.imgUrl} alt="" />
                </div>
                <div className="col-9">
                    <div className="title">
                        {item.title}
                    </div>
                    <div className="author">
                        {item.author}
                    </div>
                    <div className="price">
                        {item.price}
                    </div>
                </div>
            </div>
            <div className="modal-footer px-5 py-4">
                <div className="app-button" onClick={() => deleteItem(item.id)}>Xóa sản phẩm</div>
                <div className="app-button white" onClick={close}>Hủy</div>
            </div>
        </div>
        </div>
        } 
        </>
    );
}
export default Modal