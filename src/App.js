// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom"
import AppHeader from './components/common/header/AppHeader'
import AppFooter from './components/AppFooter';
import Home from './views/Home';
import Category from './components/Category'
import AppAlert from './components/alert/AppAlert';
import Detail from './views/Detail'
import { useEffect } from "react";
import ProductService from './services/product.service'
import { Link } from "react-router-dom"
import Cart from './views/Cart.jsx'
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
  return (
    <>
      <AppHeader/>
        <Routes>
          <Route path="/" element={<Home books={books}/>}/>
          <Route path="/product/:id" element={<Detail/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
      <AppFooter/>
    </>
  );
}

export default App;
