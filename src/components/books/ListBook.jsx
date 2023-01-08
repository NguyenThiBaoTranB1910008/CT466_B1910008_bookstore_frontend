import Book from "./Book";
function ListBook({books,currencyFormat}){
    return(
        <>
        <div className= "hot-book pb-5">
            {
                books.map((book, index)=>(
                    <Book prop={book} key={index} currencyFormat={currencyFormat}/>
                ))
            }
        </div> 
        </>
    )
}

export default ListBook;