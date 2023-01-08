import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom"
import AppHeader from './components/common/header/AppHeader'
import AppFooter from './components/common/footer/AppFooter';
import Home from './views/Home';
import ProductService from './services/product.service'
function App() {
  const [books, setBooks] = useState([])
    useEffect(() => {
        async function fetchData(){
                    try {
                        const apibooks = await ProductService.getAll();
                        setBooks(apibooks)
                        
                    } catch (error) {
                        console.log(error);
                    }
        }
        fetchData()
    },[]);
    const currencyFormat= (money) => {
      const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9}
      const formated = new Intl.NumberFormat('vi-VN', config).format(money);
      return formated;
    }
  return (
    <>
      <AppHeader books={books}/> 
         <Routes>
          <Route path="/" element={<Home books={books} currencyFormat={currencyFormat}/>}/>
        </Routes> 
       <AppFooter/> 
     </> 
  );
}

export default App;
