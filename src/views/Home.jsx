import ListBook from "../components/books/ListBook";
import ListBrand from "../components/brand/ListBrand";
import ListCategory from "../components/category/ListCategory";
import { useEffect, useState } from 'react';
import ProductService from "../services/product.service";
function Home({books,currencyFormat}){
  const [newbooks, setNewBooks]= useState([])
  useEffect(()=>{
    async function fetchData(){
      try{
        const apinewbooks = await ProductService.getLimit()
        setNewBooks(apinewbooks)
        console.log(apinewbooks)
      }
      catch(error){
        console.log(error);
      }
    }
    fetchData()
  },[])
    return(
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
                          <div className="carousel-item">
                            <img src="https://img.freepik.com/free-vector/flat-world-book-day-banners-set_23-2148885270.jpg?w=740&t=st=1672486028~exp=1672486628~hmac=16ad4974d3e0085afbdb1d6b33891996f872af938b854ccc1fd77a69e53ffb7e" className="d-block w-100" alt="..."></img>
                          </div>
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
            <div className="connect row">
                <div className="caterory-title col-4 pt-3">
                    <h2>Đăng ký nhận thông báo mới</h2>
                </div>
                <div className="input-group mb-3 col-8">
                    <input type="text" className="form-control connect-input" placeholder="Nhập email để kết nối với chúng tôi" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                    <span className="input-group-text" id="connect-button">Đăng ký</span>
                </div>
          </div>
        </div>
    )
}

export default Home;