import React from "react";
import { useState,useContext , useEffect} from "react";
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
import axios from "axios";

function CheckOut(){
  const token = 'f940af7b-7358-11ee-a59f-a260851ba65c';
    const shopID = 4655800;

    const apiProvince = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
    const apiDistrict = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
    const apiWard = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
    const apiService = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services';
    const apiFee = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';

    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);
    const [listService, setListService] = useState([]);
    const [listFee, setListFee] = useState([]);

    const [inputs, setInputs] = useState([]);
    const [idService, setIdService] = useState([]);
    const [idWard, setIdWard] = useState([]);
    const [idDistrict, setIdDistrict] = useState([]);

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
        district:"",
        ward:"",
        note: "",
    },
    validationSchema: Yup.object({
        phone:Yup.string().required("Phone is required")
              .matches(phoneRegExp, 'Phone number is not valid'),
        firstname:  Yup.string().required("Firstname is required"),
        lastname:  Yup.string().required("Lastname is required"),
        address:  Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        district: Yup.string().required("District is required"),
        ward: Yup.string().required("Ward is required"),
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
              await cartService.deleteAll(localStorage.getItem('user'))
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

    const getListProvince = () => {
        axios.get(
            apiProvince,
            {
                headers: {token: token}
            }
        ).then(function (response) {
            setListProvince(response.data.data);
        });
    }

    const getListDistrict = (idProvince) => {
        axios.get(
            apiDistrict,
            {
                headers: {token: token},
                params: {province_id: idProvince}
            }
        ).then(function (response) {
            setListDistrict(response.data.data);
        });
    }

   

    const getListWard = (idDistrict) => {
        axios.get(
            apiWard,
            {
                headers: {token: token},
                params: {district_id: idDistrict}
            }
        ).then(function (response) {
            setListWard(response.data.data);
        });
    }


    const getService = (toDistrict) => {
        axios.get(
            apiService,
            {
                headers: {token: token},
                params: {
                    shop_id: shopID,
                    from_district: 1442, //tphcm
                    to_district: toDistrict,
                }
            }
        ).then(function (response) {
            setListService(response.data.data);
        });
    }

    const getFee = (serviceID, toWardCode, toDistrict) => {
        console.log(toDistrict,toWardCode)
        axios.get(
            apiFee,
            {
                headers: {
                    token: token, 
                    shop_id: shopID
                },
                params: {
                    from_district_id: 1454, //tphcm,
                    from_ward_code:"21207",
                    service_type_id:2,
                    to_district_id: toDistrict,
                    to_ward_code: toWardCode,
                    height:50,
                    length:20,
                    weight:200,
                    width:20,
                    insurance_value:10000,
                    cod_failed_amount:2000,
                    coupon: null
                    }
            }
        ).then(function (response) {
            setListFee(response.data.data.total);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let idTPHCM = 1442;
        let districtID;
        let provinceID;

        setInputs(values => ({...values, [name]: value}));

        if (name === 'city' && value !== 0) {
            provinceID = value;

            getListDistrict(provinceID);
            formik.values.city = provinceID
        } else if (name === 'district' && value !== 0) {
            districtID = value
            setIdDistrict(districtID);

            getListWard(districtID);
            getService(idTPHCM, districtID);
        } else if (name === 'ward' && value !== 0) {
            setIdWard(value);

        } else if (name === 'service' && value !== 0) {
            setIdService(value);
        }
        if (idService && idWard && idDistrict) {
            getFee(idService, idWard, idDistrict);
        }
    }

    useEffect(() => {
        getListProvince();
    }, []);

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
              <div class="row py-1">
                <div class="field col-6">
                        <input type="text" class="form-control" name="address" 
                                    placeholder="Số nhà"  value={formik.values.address}
                                    onChange={formik.handleChange} 
                                    className={formik.errors.address && formik.touched.address && "error_input"}/> 
                        {formik.errors.address && formik.touched.address && (
                                <p className="form_error">{formik.errors.address}</p>
                            )}
                </div>
                <div class="col-6 form-group">
                    <select class="form-control form-select field" name="city"
                        onChange={formik.handleChange}
                        onClick={handleChange}
                        value={formik.values.city}
                        className={formik.errors.city && formik.touched.city && "error_input"}>
                        <option defaultValue value="#">Thành phố</option>
                        {listProvince.map((item) => {
                            return (
                                <option key={item.ProvinceID} value={item.ProvinceID}>
                                    {item.ProvinceName}
                                </option>
                            )
                        })}
                    </select>
                  </div>
              </div>
                <div class="row py-1">
                    <div class="form-group col-6 ">
                        <select class="form-control form-select field" name="district" 
                             onChange={formik.handleChange}
                             onClick={handleChange}
                             value={formik.values.district}
                             className={formik.errors.district && formik.touched.district && "error_input"}>
                        <option defaultValue value="#">Huyện</option>
                        {listDistrict.map((item) => {
                            return (
                                <option key={item.DistrictID} value={item.DistrictID}>
                                    {item.DistrictName}
                                </option>
                            )
                        })}
                    </select> 
                    </div>
                    <div class="form-group col-6 ">
                        <select class="form-control form-select field" name="ward" 
                            onChange={formik.handleChange}
                            onClick={handleChange}
                            value={formik.values.ward}
                            className={formik.errors.ward && formik.touched.ward && "error_input"}>
                            <option defaultValue value="#">Xã</option>
                            {listWard.map((item) => {
                                return (
                                    <option key={item.WardCode} value={item.WardCode}>
                                        {item.WardName}
                                    </option>
                                )
                            })}
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
                <div style={{width: "70%", display:"inline-block"}}>Phí vận chuyển:</div>
                <span className="reorder-col3">{currencyFormat(listFee) }</span>
              </div>
              <div class="reordertotal" >
                  <div style={{width: "70%", display:"inline-block"}} >Tổng đơn hàng:</div >
                  <span class="order-price  reorder-col3">{currencyFormat(getTotal() + listFee) }</span>
              </div>  
          </div>
        </div> 
      </div>
    <AppFooter/> 
    </>
    )
}

export default CheckOut