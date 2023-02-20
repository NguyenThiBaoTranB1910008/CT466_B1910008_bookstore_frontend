import { Link } from "react-router-dom"
function EmptyCart({imgUrl, title}){
    return(
        <div className='empty-cart'>
            <img src={imgUrl} alt="" />
            <div className="alert">
                <h2 >{title}</h2>
                <Link to="/menu" state={{cate: ""}}><button className='app-button'>Tiếp tục mua sắm</button></Link>
            </div>
        </div>
    )
}

export default EmptyCart