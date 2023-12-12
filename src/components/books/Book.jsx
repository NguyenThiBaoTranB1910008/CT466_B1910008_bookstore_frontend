import { Link } from "react-router-dom"
import { currencyFormat } from "../../auth.action";

function Book({prop}){
    return (
        <>
            <div className="book">
                <Link to={`/product/${prop.id}`}>
                        <img src={prop.imageUrl} alt=""/>
                        {prop.quantity === 0  &&
                        <div className="outofstockdemo center">
                            <span className="notify">Hết Hàng</span>
                        </div>}
                        <div className="book-info">
                            <p className="book-name pt-2">{
                                (prop.title.length > 33) ?  prop.title.substring(0,33) + "..." : prop.title
                            }</p>
                            <p className="book-author pb-1">{prop.author}</p>
                        </div>
                        <p className="book-price">{currencyFormat(prop.price)}</p>
                </Link>
            </div>
        </>
    )
}

export default Book;