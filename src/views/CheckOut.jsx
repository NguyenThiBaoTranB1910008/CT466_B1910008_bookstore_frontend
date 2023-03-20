import React from "react";
import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { notify, currencyFormat } from "../auth.action";
import OrderService from "../services/order.service";
import cartService from "../services/cart.service";
import productService from "../services/product.service";
import Context from "../store/Context";
import AppHeader from "../components/common/header/AppHeader";
import AppFooter from "../components/common/footer/AppFooter";

function CheckOut(){
  const location = useLocation()
  const navigate = useNavigate()
  const { cart } = location.state
  const [state, dispatch] = useContext(Context) 

  const getTotal = ()=>{
    var total=0
    cart.map((cartItem) =>(
      total+= cartItem.price*cartItem.quantity
    ))
    return total
  }


  const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
  const formik = useFormik({
    initialValues: {
        phone: "",
        firstname: "",
        lastname: "",
        address: "",
        city:"",
        country:"",
        note: "",
    },
    validationSchema: Yup.object({
        phone:Yup.string().required("Phone is required")
              .matches(phoneRegExp, 'Phone number is not valid'),
        firstname:  Yup.string().required("Firstname is required"),
        lastname:  Yup.string().required("Lastname is required"),
        address:  Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        country: Yup.string().required("Country is required"),
    }),
    onSubmit: values => {
      dispatch({
        type: "updatecart",
        cartItem: 0
      })
      const order={
        ...values,
        accname: localStorage.getItem('user'),
        cart: cart,
        dayOrder:  moment().format("DD/MM/YYYY, h:mm:ss a"),
        total: getTotal() + getTotal()*5/100
      }
      const addOrder = async () =>{
          try{
              await OrderService.create(order)
              notify('success',"Đặt hàng thành công")
              await cartService.deleteAll()
              cart.map(async (cartitem) => {
                await productService.order(cartitem.idbook, {id: cartitem.idbook, quantity: cartitem.quantity})
              })
              navigate('/cart')
            }
            catch(error){
              console.log(error);
            }
      }
      addOrder()
    }
  });

  return (
    <>
    <AppHeader/>
      <div className="container main">
        {/* <h2>Checkout</h2> */}
        <div className="row checkout">
          <div class="col-7 info" id="addressForm" >
          <form action="#" class="signup" onSubmit={formik.handleSubmit}>
                <h4>Thông tin liên hệ:</h4>
                <div className="field">
                  <input type="text" class="form-control" name="phone"  
                                placeholder="Số điện thoại" value={formik.values.phone}
                                onChange={formik.handleChange} 
                                className={!formik.errors.phone ? "": "error_input"}/>
                   {formik.errors.phone && formik.touched.phone && (
                            <p className="form_error">{formik.errors.phone}</p>
                        )}
                </div>    
              <div class="pt-4">
              <h4>Địa chỉ giao hàng</h4>
              <div class="row pb-1 form-group">
                  <div class="col-6 field">
                        <input type="text" class="form-control" name="lastname" 
                                placeholder="Họ" value={formik.values.lastname}
                                onChange={formik.handleChange} 
                                className={formik.errors.lastname && formik.touched.lastname && "error_input"}/>
                         {formik.errors.lastname && formik.touched.lastname && (
                            <p className="form_error">{formik.errors.lastname}</p>
                        )}
                    </div>  
                  <div class="col-6 field">
                      < input type="text" class="form-control"  name="firstname"
                                placeholder="Tên"  value={formik.values.firstname}
                                onChange={formik.handleChange} 
                                className={formik.errors.firstname  && formik.touched.firstname && "error_input"}/>
                       {formik.errors.firstname && formik.touched.firstname && (
                            <p className="form_error">{formik.errors.firstname}</p>
                        )}
                    </div>
              </div>
              <div class="field">
                    <input type="text" class="form-control" name="address" 
                                placeholder="Số nhà"  value={formik.values.address}
                                onChange={formik.handleChange} 
                                className={formik.errors.address && formik.touched.address && "error_input"}/> 
                     {formik.errors.address && formik.touched.address && (
                            <p className="form_error">{formik.errors.address}</p>
                        )}
              </div>
                <div class="row py-1">
                  <div class="field col-6 ">
                        <input type="text" class="form-control" name="city" 
                                placeholder="Tên thành phố" value={formik.values.city}
                                onChange={formik.handleChange} 
                                className={formik.errors.city && formik.touched.city && "error_input"}/>
                         {formik.errors.city && formik.touched.city && (
                            <p className="form_error">{formik.errors.city}</p>
                        )}
                  </div>
                  <div class="form-group col-6 ">
                    <select class="form-select form-control field" name="country" 
                          value={formik.values.country}
                          // onBlur={handleBlur}
                          onChange={formik.handleChange}>
                      <option value="" >Quốc gia</option>
                      <option value="Việt Nam" >Việt Nam</option>
                      <option value="Thái Lan">Thái Lan</option>
                      <option value="Nhật Bản">Nhật Bản</option>
                      <option value="Trung Quốc">Trung Quốc</option>
                    </select>  
                    </div> 
                </div>
              </div>
              <div className="pt-4">
                <h4>Lưu ý cho người bán</h4>
                <div class="field">
                      <input type="text" name="note" 
                                  placeholder="Lưu ý cho người bán"  value={formik.values.note}
                                  onChange={formik.handleChange} /> 
                </div>
              </div>
              {/* <input type="submit" value="Login"/> */}
              <div className="ordertotal cart-total-detail end">
                <button className="order-button mt-3" type="submit">ĐẶT HÀNG</button>
              </div> 
          </form>
          </div>
          <div class="col-4 reorder px-3">
            <div className="reorder-header">
              Chi tiết đơn hàng
            </div>
          <div className="reorder-list">
            {cart.map((cartitem) => (
              <div class="reorder-item"  >
                <div class="reorder-col1">
                    <img src={cartitem.imgUrl} alt=""/>
                </div>
                <div class="reorder-col2">
                    <span>{cartitem.title}</span>
                </div>
                <div class="reorder-col3">
                    <span class="order-price">{cartitem.price} x {cartitem.quantity} </span>
                </div>
              </div>))}
          </div>
              <div class="reordertotal">
                <div style={{width: "70%", display:"inline-block"}}>Phí vận chuyển (5% đơn hàng):</div>
                <span className="reorder-col3">{currencyFormat(getTotal()*5/100) }</span>
              </div>
              <div class="reordertotal" >
                  <div style={{width: "70%", display:"inline-block"}} >Tổng đơn hàng:</div >
                  <span class="order-price  reorder-col3">{currencyFormat(getTotal() + getTotal()*5/100) }</span>
              </div>  
          </div>
        </div> 
      </div>
    <AppFooter/>
    </>
    )
}

export default CheckOut