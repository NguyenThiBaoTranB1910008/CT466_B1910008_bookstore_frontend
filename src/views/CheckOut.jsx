import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from 'react-router-dom'
import OrderService from "../services/order.service";
import cartService from "../services/cart.service";
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { notify, currencyFormat } from "../auth.action";
import { useContext } from "react";
import Context from "../store/Context";
import AppHeader from "../components/common/header/AppHeader";
import AppFooter from "../components/common/footer/AppFooter";
import productService from "../services/product.service";

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
              notify('success',"?????t h??ng th??nh c??ng")
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
                <h4>Th??ng tin li??n h???:</h4>
                <div className="field">
                  <input type="text" class="form-control" name="phone"  
                                placeholder="S??? ??i???n tho???i" value={formik.values.phone}
                                onChange={formik.handleChange} 
                                className={!formik.errors.phone ? "": "error_input"}/>
                   {formik.errors.phone && formik.touched.phone && (
                            <p className="form_error">{formik.errors.phone}</p>
                        )}
                </div>    
              <div class="pt-4">
              <h4>?????a ch??? giao h??ng</h4>
              <div class="row pb-1 form-group">
                  <div class="col-6 field">
                        <input type="text" class="form-control" name="lastname" 
                                placeholder="H???" value={formik.values.lastname}
                                onChange={formik.handleChange} 
                                className={!formik.errors.lastname ? "": "error_input"}/>
                         {formik.errors.lastname && formik.touched.lastname && (
                            <p className="form_error">{formik.errors.lastname}</p>
                        )}
                    </div>  
                  <div class="col-6 field">
                      < input type="text" class="form-control"  name="firstname"
                                placeholder="T??n"  value={formik.values.firstname}
                                onChange={formik.handleChange} 
                                className={!formik.errors.firstname? "": "error_input"}/>
                       {formik.errors.firstname && formik.touched.firstname && (
                            <p className="form_error">{formik.errors.firstname}</p>
                        )}
                    </div>
              </div>
              <div class="field">
                    <input type="text" class="form-control" name="address" 
                                placeholder="S??? nh??"  value={formik.values.address}
                                onChange={formik.handleChange} 
                                className={!formik.errors.address? "": "error_input"}/> 
                     {formik.errors.address && formik.touched.address && (
                            <p className="form_error">{formik.errors.address}</p>
                        )}
              </div>
                <div class="row py-1">
                  <div class="field col-6 ">
                        <input type="text" class="form-control" name="city" 
                                placeholder="T??n th??nh ph???" value={formik.values.city}
                                onChange={formik.handleChange} 
                                className={!formik.errors.city? "": "error_input"}/>
                         {formik.errors.city && formik.touched.city && (
                            <p className="form_error">{formik.errors.city}</p>
                        )}
                  </div>
                  <div class="form-group col-6 ">
                    <select class="form-select form-control field" name="country" 
                          value={formik.values.country}
                          // onBlur={handleBlur}
                          onChange={formik.handleChange}>
                      <option value="" >Qu???c gia</option>
                      <option value="Vi???t Nam" >Vi???t Nam</option>
                      <option value="Th??i Lan">Th??i Lan</option>
                      <option value="Nh???t B???n">Nh???t B???n</option>
                      <option value="Trung Qu???c">Trung Qu???c</option>
                    </select>  
                    </div> 
                </div>
              </div>
              <div className="pt-4">
                <h4>L??u ?? cho ng?????i b??n</h4>
                <div class="field">
                      <input type="text" name="note" 
                                  placeholder="L??u ?? cho ng?????i b??n"  value={formik.values.note}
                                  onChange={formik.handleChange} /> 
                </div>
              </div>
              {/* <input type="submit" value="Login"/> */}
              <div className="ordertotal cart-total-detail end">
                <button className="order-button mt-3" type="submit">?????T H??NG</button>
              </div> 
          </form>
          </div>
          <div class="col-4 reorder px-3">
            <div className="reorder-header">
              Chi ti???t ????n h??ng
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
                <div style={{width: "70%", display:"inline-block"}}>Ph?? v???n chuy???n (5% ????n h??ng):</div>
                <span className="reorder-col3">{currencyFormat(getTotal()*5/100) }</span>
              </div>
              <div class="reordertotal" >
                  <div style={{width: "70%", display:"inline-block"}} >T???ng ????n h??ng:</div >
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