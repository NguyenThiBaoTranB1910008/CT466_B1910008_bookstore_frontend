import { useParams} from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import ListBook from "../books/ListBook"
import ProductService from "../../services/product.service"
import { useLocation } from 'react-router-dom'
import BrandFilter from "./filter/BrandFilter"
import PriceFilter from "./filter/PriceFilter"
import CategoryFilter from "./filter/CategoryFilter"
import { currencyFormat } from "../../auth.action"
function Caterory(){
    const [books, setBooks] = useState([])
    const [bookSize, setBookSize] = useState(0)
    const [order, setOrder] = useState("Sắp xếp theo giá")
    const {q} = useParams()
    const location = useLocation()
    const { cate } = location.state // "useLocation" to get the state
    const [filter, setFilter] = useState({})

    useEffect(()=>{
        setFilter({...filter, category: cate ? cate : ""})
    },[])

    useEffect(() => {
        async function fetchData(){
            try {
                    var apibooks = await ProductService.getByFilter(filter)
                    setBookSize(apibooks.length)
                    setBooks(apibooks)    
                }
                catch (error) {
                    console.log(error);
            }
        }
        fetchData()
    },[filter])

    useEffect(()=>{
        if(q != undefined){
            handleFilters('search',q)
        }
    },[q])

    const handleFilters = ( item, filters) => {

        const newFilters = {...filter}

        if (item === "price") {
            const min = document.getElementById("minprice")
            const max = document.getElementById("maxprice")
            newFilters.min = parseInt(min.value)
            newFilters.max = parseInt(max.value)
        }
        else if(item === "order"){
            if(filters=="Giảm dần")
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
        <div className="container main" id="category-page">
            <div className="row">
                <div className="col-3 filter">
                    <CategoryFilter filter={filter} handleFilters={handleFilters}/>
                    <PriceFilter handleFilters={handleFilters}/>
                    <BrandFilter handleFilters={handleFilters}/> 
                </div>
                <div className="col-9">
                    <div className="listinfo">
                        <div className="">
                            {q == undefined ?  "" :<span>Kết quả tìm kiếm với từ khóa "<b>{q}</b>":</span>}
                            <div>Số lượng: {bookSize} sản phẩm</div>
                        </div>
                        <div className="orderBox">
                            <div class="mainOrder">{order}</div>
                            <span onClick={openOrderBox}><i class="fa-sharp fa-solid fa-chevron-down"></i></span>
                        </div>
                            <div id="orderList" className="none" >
                                <div className={order=="Giảm dần" ? "selected":""} onClick={()=>handleFilters('order','Giảm dần')}>Giảm dần</div>
                                <div className={order=="Tăng dần" ? "selected":""} onClick={()=>handleFilters('order','Tăng dần')}>Tăng dần </div>
                            </div>
                    </div>
                    <ListBook books={books} currencyFormat={currencyFormat}/> 
                </div>
            </div>
        </div>
    )
}

export default Caterory