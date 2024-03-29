import ListBook from "../components/books/ListBook";
import ListBrand from "../components/brand/ListBrand";
import ListCategory from "../components/category/ListCategory";
import { useEffect, useState } from 'react';
import ProductService from "../services/product.service";
import { currencyFormat } from "../auth.action";
import AppHeader from "../components/common/header/AppHeader";
import AppFooter from "../components/common/footer/AppFooter";

function Home({books}){
  const [newbooks, setNewBooks]= useState([])
  useEffect(()=>{
    async function fetchData(){
      try{
        const apinewbooks = await ProductService.getLimit()
        setNewBooks(apinewbooks)
      }
      catch(error){
        console.log(error);
      }
    }
    fetchData()
  },[])
    return(
      <>
      <AppHeader/>
        <div className="container main">
            <div className="row ">
                <div className="col-8">
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                          <div className="carousel-item active">
                            <img src="https://img.freepik.com/free-vector/literature-book-club-sale-banner-template_23-2149718643.jpg?w=2000" className="d-block w-100" alt="..."></img>
                          </div>
                          <div className="carousel-item">
                            <img src="https://img.freepik.com/free-psd/world-book-day-banner-template_23-2149323909.jpg?w=2000" className="d-block w-100" alt="..."></img>
                          </div>
                          {/* <div className="carousel-item">
                            <img src="https://www.bookswagon.com/images/bannerimages/82_inr.jpg?v=1.4" className="d-block w-100" alt="..."></img>
                          </div> */}
                        </div>
                        <button className="carousel-control-prev  carousel-control-prev-next-icon" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                          <i className="fa-solid fa-chevron-left carousel-control-icon"></i>
                        </button>
                        <button className="carousel-control-next  carousel-control-prev-next-icon" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                          <i className="fa-solid fa-chevron-right carousel-control-icon"></i>
                       </button>
                      </div>
                </div>
                <div className="col-4 banner">
                    <div className="banner-item">
                        <img src="https://img.freepik.com/free-vector/flat-world-book-day-horizontal-banner-template_23-2149338397.jpg?w=826&t=st=1672486141~exp=1672486741~hmac=f2970fd6dfbeda3bccb4556c97caa99a2a473477ffd565dd429be6b1fe468771" alt="">
                        </img>
                    </div>
                    <div className="banner-item">
                      <img src="https://img.freepik.com/free-vector/hand-drawn-book-club-sale-banner_23-2149750499.jpg?w=826&t=st=1672486327~exp=1672486927~hmac=926385deffafeb97d7ee3251fe6100c28f3479acff14a79190870844542d88b4" alt="">
                        </img>
                  </div>
                </div>
            </div>
            <ListCategory/>
            <div className="caterory-book row">
                <div className="caterory-title pt-4">
                    <h2>Sách mới</h2>
                    <img  className="categoty-img" src="./sparkles.png" alt="" />
                </div>
                <ListBook books={newbooks} currencyFormat={currencyFormat}/> 
                <hr/>
            </div>
            <div className="caterory-book row">
              <div className="caterory-title">
                <h2>Nhà xuất bản</h2>
              </div>
              <ListBrand/>
              <hr/>
            </div>
        </div>
      <AppFooter/>
      </>
    )
}

export default Home;