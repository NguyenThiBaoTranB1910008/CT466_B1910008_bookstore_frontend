function Pagination({pagination,handlePagination, total}){
    return(
        <>
            <div className="pagination-container">
                <div className="pg-info">
                    <span>Hiển thị </span>
                    <b> {(pagination.page-1)*pagination.limit + 1} - 
                        {
                        (pagination.page*pagination.limit) <= total.current ?
                        pagination.page*pagination.limit : total.current
                        }
                   </b> 
                    <span> trong <b>{total.current}</b> sản phẩm.</span>
                </div>
                <div className="pg-button">
                    <span className="pg-button-left" onClick={() => handlePagination("pre")}>
                    <i class="fa-solid fa-angle-left"></i>
                    </span>
                    <b> {pagination.page}/{Math.ceil(total.current/pagination.limit)} </b>
                    <span className="pg-button-right" onClick={() => handlePagination("next")}>
                    <i class="fa-solid fa-angle-right"></i>
                    </span>
                </div>
            </div>
        </>
    )
}

export default Pagination;
