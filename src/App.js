import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom"
import AppHeader from './components/common/header/AppHeader'
import AppFooter from './components/common/footer/AppFooter';
import Home from './views/Home';
import ProductService from './services/product.service'
import SignUp from './views/SignUp';
import Login from './views/Login';
import { useContext } from 'react';
import Context from './store/Context';

function App() {
  const [books, setBooks] = useState([])
  const [user, setUser] = useState(null)
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


    // const [state, dispatch] = useContext(Context)
    // console.log(state)

  return (
    <>
      <AppHeader/> 
         <Routes>
          <Route path="/" element={<Home books={books} currencyFormat={currencyFormat}/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes> 
       <AppFooter/>
     </> 
  );
}


export default App;
