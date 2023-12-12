import './App.css';
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Login from './views/Login';
import Category from './views/Menu'
import Cart from './views/Cart.jsx'
import Detail from './views/Detail';
import AdminBookDetail from './components/admin/AdminBookDetail';
import CheckOut from './views/CheckOut';
import Account from './views/Account';
import AdminPage from './views/AdminPage';
import Review from './views/Review.jsx'

function App() {
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
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/menu" element={<Category/>}/>
              <Route path="/menu/:q" element={<Category/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/product/:id" element={<Detail/>}/>
              <Route path="/checkout" element={<CheckOut/>}/>
              <Route path="/myorder" element={<Account/>}/>
              <Route path="/review" element={<Review/>}/>
              <Route path="/admin" element={<AdminPage/>}/>
              <Route path="/admin/editbook" element={<AdminBookDetail/>}/>
              <Route path="/admin/editbook" element={<AdminBookDetail/>}/>
           </Routes> 
         </>
  );
}


export default App;