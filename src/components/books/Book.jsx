import { Link } from "react-router-dom"
function Book({prop, currencyFormat}){
    return (
        <>
            <div className="book">
                <Link to={`/product/${prop.id}`}>
                        <img src={prop.imageUrl} alt=""/>
                        <p className="book-name pt-3">{prop.title}</p>
                        <p className="book-author">{prop.author}</p>
                        <p className="book-price">{currencyFormat(prop.price)}</p>
                </Link>
            </div>
        </>
    )
}

export default Book;