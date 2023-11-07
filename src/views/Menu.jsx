import { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import ListBook from "../components/books/ListBook"
import ProductService from "../services/product.service"
import BrandFilter from "../components/category/filter/BrandFilter"
import PriceFilter from "../components/category/filter/PriceFilter"
import CategoryFilter from "../components/category/filter/CategoryFilter"
import Pagination from "../components/books/Pagination"
import AppHeader from "../components/common/header/AppHeader"
import AppFooter from "../components/common/footer/AppFooter"
function Caterory(){
    const [books, setBooks] = useState([])
    const totalBook = useRef();
    const location = useLocation()
    const search = new URLSearchParams(location.search).get('search')
    const brand = new URLSearchParams(location.search).get('brand')
    const [filter, setFilter] = useState({
        category: location.state.cate || "",
        pagination: {
            page: 1,
            limit: 3
        }
    })
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
                    totalBook.current = apibooks.length
                    apibooks = apibooks.slice((filter.pagination.page-1)*filter.pagination.limit, filter.pagination.page*filter.pagination.limit) 
                    setBooks(apibooks)    
                }
                catch (error) {
                    console.log(error);
            }
        }
        fetchData()
        },[filter])

    function interChangeSort() {
        const mysort = document.getElementById('order').value
        const array = [...books]
        for (let i = 0; i < array.length - 1; i++) {
          for (let j = i + 1; j < array.length; j++) {
            if(mysort === 'DESC'){
                if (array[j].price > array[i].price) {
                    let t = array[i];
                    array[i] = array[j];
                    array[j] = t;            
                }
            }else{
                if (array[j].price < array[i].price) {
                    let t = array[i];
                    array[i] = array[j];
                    array[j] = t;
                }
            }
          }
        }
        setBooks(array)
    }

    const handleFilters = ( item, filters) => {
        const newFilters = {...filter}
        if (item === "price") {
            const min = document.getElementById("minprice")
            const max = document.getElementById("maxprice")
            newFilters.min = parseInt(min.value)
            newFilters.max = parseInt(max.value)
        }
        else{
            newFilters[item] = filters
        }
        setFilter(newFilters)
    }

    const handlePagination = (cmt) => {
        if (cmt === "pre" && filter.pagination.page > 1){
            setFilter({
                ...filter,
                pagination:{
                    ...filter.pagination,
                    page: filter.pagination.page - 1
                }
            })
        }else if (cmt === "next" && filter.pagination.page < Math.ceil(totalBook.current/filter.pagination.limit)){
            setFilter({
                ...filter,
                pagination:{
                    ...filter.pagination,
                    page: filter.pagination.page + 1
                }
            })
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
                        <select id="order" class="form-select" onChange={()=>interChangeSort()}>
                                <option value="" >Sắp xếp</option>
                                <option value="DESC">Giảm dần</option>
                                <option value="ASC">Tăng dần</option>
                        </select>
                    </div>
                    <ListBook books={books}/> 
                    <Pagination pagination={filter.pagination} handlePagination={handlePagination} total={totalBook}/>
                </div>
            </div>
        </div>
        <AppFooter/>
        </>
    )
}
export default Caterory