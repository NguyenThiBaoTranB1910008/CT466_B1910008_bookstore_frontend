function CategoryFilter({filter, handleFilters}){
    const categories=[
        {
            kh:"TL",
            name:"Tâm lý - Kỹ năng sống"
        },
        {
            kh:"MG",
            name:"Manga - Comic"
        },
        {
            kh:"SGK",
            name:"Giáo khoa - Tham khảo"
        },
        {
            kh:"NN",
            name:"Sách học ngoại ngữ"
        },
        {
            kh:"NG",
            name:"Sách nước ngoài"
        },
    ]
    return(
        <div className="category-filter">
            <h4 >Thể loại</h4>
            <ul className="category-book">
                <li className={filter.category=="" ? "selected" : ""} 
                        onClick={()=>handleFilters("category","")}>Tất cả sách</li>
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