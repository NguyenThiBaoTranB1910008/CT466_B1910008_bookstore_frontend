function CategoryFilter({filter, handleFilters}){
    const categories=[
        {
            kh:"TL",
            name:"Tâm Lý - Kỹ Năng Sống"
        },
        {
            kh:"MG",
            name:"Manga - Comic"
        },
        {
            kh:"SGK",
            name:"Giáo Khoa - Tham Khảo"
        },
        {
            kh:"NN",
            name:"Sách Học Ngoại Ngữ"
        },
        {
            kh:"NG",
            name:"Sách Nước Ngoài"
        },
    ]
    return(
        <div className="category-filter">
            <h4 >Thể loại</h4>
            <ul className="category-book">
                <li className={filter.category=="" ? "selected" : ""} 
                        onClick={()=>handleFilters("category","")}>Tất Cả Sách</li>
                {
                    categories.map((cate)=>(
                        <li className={filter.category===cate.kh ? "selected" : ""} 
                                onClick={()=>handleFilters("category",cate.kh)}>{cate.name}</li>
                    ))
                }
                
            </ul>
        </div>
    )
}

export default CategoryFilter