import Book from "./Book";
function ListBook({books}){
    return(
        <>
        <div className= "hot-book pb-5">
            {
                books.map((book, index)=>(
                    <Book prop={book} key={index}/>
                ))
            }
        </div> 
        </>
    )
}

export default ListBook;