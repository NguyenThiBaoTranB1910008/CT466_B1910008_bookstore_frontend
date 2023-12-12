import { Doughnut, Line, Bar } from "react-chartjs-2";
import { useState, useEffect } from 'react';
import productService from '../../services/product.service';
import orderService from "../../services/order.service";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
Chart.register(...registerables);
Chart.defaults.datasets.bar.maxBarThickness = 73;

function StatisticManagment(){
    const [books, setBooks]= useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [chartDoughnutData, setChartDoughnutData]= useState()
    const [chartLineData, setChartLineData]= useState()
    var category_label = ["Tâm lý-kỹ năng sống", "Manga-comic", "Giáo khoa-tham khảo", "Sách học ngoại ngữ", "Sách nước ngoài"]
    const [category_sl, setCategorySL]= useState([])
    async function fetchData(){
        try{
            var apicategory_sl = []
            const tl = await productService.getByFilter({category : "TL"})
            const mg = await productService.getByFilter({category : "MG"})
            const sgk = await productService.getByFilter({category : "SGK"})
            const nn = await productService.getByFilter({category : "NN"})
            const ng = await productService.getByFilter({category : "NG"})
            apicategory_sl= ([tl.length, mg.length , sgk.length, nn.length, ng.length])
            setChartDoughnutData(
                {
                    labels: category_label,
                    datasets: [
                      {
                        data:  apicategory_sl,
                        backgroundColor: [
                          "#33ACE3",
                          "#EA6964",
                          "rgba(255, 206, 86, 0.6)",
                          "#4AB62C",
                          "#E78C89",
                        ],
                      },
                    ],
                  }
            )
        }
        catch(error){
            console.log(error);
        }
    }
    
    useEffect(()=>{
        fetchData()
        statisticOrder()
    },[startDate, endDate])
    
    const statisticOrder= async() =>{
        try{
            var dayOrder = []
            var day
            var slorder = 0
            var slarray = []
            var apiorder =await orderService.statistic(
                {
                    dateStart : moment(startDate).format("DD/MM/YYYY") + ", 0:00:00 am",
                    dateEnd : moment(endDate).format("DD/MM/YYYY" + ", 23:59:59 pm")
            })
             apiorder.map((order)=>{
                day = order.dayOrder.substring(0,10)
                if(!dayOrder.includes(day)){
                    slorder = 0
                    apiorder.map((sl)=>{
                        if( order.dayOrder.substring(0,10) ===  sl.dayOrder.substring(0,10)){
                            slorder += 1
                        }
                    })
                    dayOrder.push(day)
                    slarray.push(slorder)
                }
            })
            setChartLineData({
                labels: dayOrder,
                datasets: [
                  {
                    label: "Doanh thu",
                    data: slarray,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0,
                    pointRadius: 7,
                    pointBackgroundColor: "#068691",
                  },
                ],
            });
        }
        catch(error){
            console.log(error);
        }
    }
    return(
        <>
            <div className="order-item p-3 mt-3">
                <div className="filter-date pb-4">
                    <div className="">
                        <DatePicker selected={startDate} className="DatePicker"
                        dateFormat="dd/MM/yyyy"
                        onChange={(date)=> {setStartDate(date); statisticOrder(date)}} />
                    </div>
                    <div className="px-3">
                        <i class="fa-solid fa-minus"></i>
                    </div>
                    <div className="">
                        <DatePicker selected={endDate} className="DatePicker"
                        dateFormat="dd/MM/yyyy"
                        onChange={(date)=> {setEndDate(date); statisticOrder(date)}} />
                    </div>
                </div>
                {
                    chartLineData ?
                    <Line data={chartLineData} /> : ""
                }
            </div>
            <div className="order-item">
                {
                    chartDoughnutData ?
                    <Doughnut data={chartDoughnutData} /> : ""
                }
            </div>
        </>
    )
}

export default StatisticManagment