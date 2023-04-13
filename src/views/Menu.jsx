import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ListBook from "../components/books/ListBook"
import ProductService from "../services/product.service"
import BrandFilter from "../components/category/filter/BrandFilter"
import PriceFilter from "../components/category/filter/PriceFilter"
import CategoryFilter from "../components/category/filter/CategoryFilter"
import AppHeader from "../components/common/header/AppHeader"
import AppFooter from "../components/common/footer/AppFooter"

function Caterory(){
    const [books, setBooks] = useState([])
    const [order, setOrder] = useState("Sắp xếp theo giá")
    const location = useLocation()
    const search = new URLSearchParams(location.search).get('search')
    const brand = new URLSearchParams(location.search).get('brand')
    const [filter, setFilter] = useState({category: location.state.cate || ""})

    useEffect(()=>{
        if(search){
            handleFilters('search',search)
        }
        if(brand){
            handleFilters('brand',[brand])
        }
    },[location.state.reMenu])

    useEffect(() => {
        async function fetchData(){
            try {
                    var apibooks = await ProductService.getByFilter(filter)
                    setBooks(apibooks)    
                }
                catch (error) {
                    console.log(error);
            }
        }
        fetchData()
    },[filter])

    const handleFilters = ( item, filters) => {
        const newFilters = {...filter}
        if (item === "price") {
            const min = document.getElementById("minprice")
            const max = document.getElementById("maxprice")
            newFilters.min = parseInt(min.value)
            newFilters.max = parseInt(max.value)
        }
        else if(item === "order"){
            if(filters==="Giảm dần")
            newFilters[item] = 'DESC'
            else
            newFilters[item] = 'ASC'
            const orderList = document.getElementById('orderList')
            orderList.classList.add('none')
            setOrder(filters)
        }
        else{
            newFilters[item] = filters
        }
        setFilter(newFilters)
    }

    const openOrderBox= () =>{
        const orderList = document.getElementById('orderList')
        if(orderList.classList.contains('none')){
            orderList.classList.remove('none')
        }else{
            orderList.classList.add('none')
        }

    }

    return(
        <>
        <AppHeader/>
        <div className="container main" id="category-page">
            <div className="row">
                <div className="col-3 filter">
                    <CategoryFilter filter={filter} handleFilters={handleFilters}/>
                    <PriceFilter handleFilters={handleFilters}/>
                    <BrandFilter handleFilters={handleFilters} brand={brand}/> 
                </div>
                <div className="col-9">
                    <div className="listinfo">
                        <div className="">
                            {search ? <span>Kết quả tìm kiếm với từ khóa "<b>{search}</b>":</span> : ""}
                            <div>Số lượng: {books.length} sản phẩm</div>
                        </div>
                        <div className="orderBox">
                            <div class="mainOrder">{order}</div>
                            <span onClick={openOrderBox}><i class="fa-sharp fa-solid fa-chevron-down"></i></span>
                        </div>
                            <div id="orderList" className="none" >
                                <div className={order==="Giảm dần" ? "selected":""} onClick={()=>handleFilters('order','Giảm dần')}>Giảm dần</div>
                                <div className={order==="Tăng dần" ? "selected":""} onClick={()=>handleFilters('order','Tăng dần')}>Tăng dần </div>
                            </div>
                    </div>
                    <ListBook books={books}/> 
                </div>
            </div>
        </div>
        <AppFooter/>
        </>
    )
}

export default Caterory