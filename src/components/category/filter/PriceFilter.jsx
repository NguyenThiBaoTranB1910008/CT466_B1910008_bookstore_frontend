function PriceFilter({handleFilters}){
    return(
        <div className="category-filter pt-3" >
            <h4>Giá</h4>
            <p>Tối thiểu</p>
            <input type="text" defaultValue="20000" id="minprice"/>
            <p>Tối đa</p>
            <input type="text" defaultValue="500000" id="maxprice"/>
            <button onClick={()=>handleFilters("price","")}>Lọc</button>
        </div>
    )
}
export default PriceFilter