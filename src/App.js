import './App.css';
import { Routes, Route } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import Context from './store/Context';
import AppHeader from './components/common/header/AppHeader'
import AppFooter from './components/common/footer/AppFooter';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Login from './views/Login';
import Category from './components/category/Category'
import Cart from './views/Cart.jsx'
import Detail from './views/Detail';
import AdminBookDetail from './components/admin/AdminBookDetail';
import CheckOut from './views/CheckOut';
import Account from './components/account/Account';
import AdminPage from './components/admin/AdminPage';

function App() {
  const [state] = useContext(Context)
  return (
    <>
      <ToastContainer position="top-center"
                      autoClose={2000}
                      hideProgressBar
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"/>
          <AppHeader/>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/menu" element={<Category/>}/>
              <Route path="/menu/:q" element={<Category/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/product/:id" element={<Detail/>}/>
              <Route path="/order" element={<CheckOut/>}/>
              <Route path="/myorder" element={<Account/>}/>
              <Route path="/admin" element={<AdminPage/>}/>
              <Route path="/admin/editbook" element={<AdminBookDetail/>}/>
           </Routes> 
         <AppFooter/>
         </>
  );
}


export default App;