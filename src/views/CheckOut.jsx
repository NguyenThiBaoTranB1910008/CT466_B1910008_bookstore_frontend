import React from "react";
import { useState,useContext , useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { notify, currencyFormat } from "../auth.action";
import OrderService from "../services/order.service";
import productService from "../services/product.service";
import addressService from "../services/address.service";
import cartService from "../services/cart.service";
import Context from "../store/Context";
import AppHeader from "../components/common/header/AppHeader";
import AppFooter from "../components/common/footer/AppFooter";
import axios from "axios";
import NewAddress from "../components/account/NewAddress";

function CheckOut(){
    const location = useLocation()
    const navigate = useNavigate()
    const { cart } = location.state
    const [state, dispatch] = useContext(Context) 
    const [address, setAddress] = useState([]);
    const [mainAddress, setMainAddress] = useState(null);
    const [listFee, setListFee] = useState([]);
    const apiFee = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
    const token = 'f940af7b-7358-11ee-a59f-a260851ba65c';
    const shopID = 4655800;
    const apiProvince = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
    const apiDistrict = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
    const apiWard = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);
    const [idProvince, setIdProvince] = useState([]);
    const [idWard, setIdWard] = useState([]);
    const [idDistrict, setIdDistrict] = useState([]);
    const [inputs, setInputs] = useState([]);

    const getTotal = ()=>{
        var total=0
        cart.map((cartItem) =>(
        total+= cartItem.price*cartItem.quantity
        ))
        return total
    }
    
    const addOrder = async () =>{
        const order={
            idAddress: mainAddress.id,
            idUser: state.loginId,
            cart: cart,
            dayOrder:  moment().format("DD/MM/YYYY, h:mm:ss a"),
            totalItems: getTotal() ,
            total: getTotal() + listFee
        }
        dispatch({
            type: "updatecart",
            cartItem: 0
        })
          try{
              await OrderService.create(order)
              notify('success',"Đặt hàng thành công")
              await cartService.deleteAll(state.loginId)
              cart.map(async (cartitem) => {
                await productService.order(cartitem.idbook, {id: cartitem.idbook, quantity: cartitem.quantity})
              })
              navigate('/cart')
            }
            catch(error){
              console.log(error);
     }
    }

    const fetchOrder = async(address) =>{
        try{
            const apiaddress = await addressService.get(state.loginId)
            setAddress(apiaddress)
            if(address != ""){
                setMainAddress(address)
            }
            else{
                setMainAddress(apiaddress[0])
                getFee(apiaddress[0].wardId, apiaddress[0].districtId)
            }

        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchOrder("")
    },[])

    const getFee = (toWardCode, toDistrict) => {
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
                    height: 50,
                    length: 20,
                    weight: 5,
                    width: 10,
                    insurance_value:0,
                    cod_failed_amount:2000,
                    coupon: null
                    }
            }
        ).then(function (response) {
            setListFee(response.data.data.total);
        });
    }

    const changeAddess = (locate) =>{
        setMainAddress(locate)
        getFee(locate.wardId, locate.districtId)
    }

    const formik = useFormik({
        initialValues: {
            name: "" ,
            phone: "",
            address: "",
            city: "",
            district:  "",
            ward:  ""
        },
        validationSchema: Yup.object({
            name:  Yup.string().required("Name is required"),
            phone:  Yup.string().required("Phone is required"),
            address:  Yup.string().required("Address is required"),
            city: Yup.string().required("City is required"),
            district: Yup.string().required("District is required"),
            ward: Yup.string().required("Ward is required"),
        }),
        onSubmit: values => { 
            var myaddress = {
                name: values.name,
                phone: values.phone,
                idUser: state.loginId,
                default_value: document.getElementById('default-address').checked ? 1 : 0,
                address: values.address,
                cityId: idProvince,
                districtId: idDistrict,
                wardId: idWard
            }
            listWard.map((item) => {
                    if(item.WardCode == values.ward){
                    myaddress = {
                        ...myaddress,
                        ward: item.WardName
                    }
                }
            })
            listDistrict.map((item) => {
                if(item.DistrictID == values.district){
                    myaddress = {
                        ...myaddress,
                        district: item.DistrictName
                    }
                }
            })
            listProvince.map((item) => {
                if(item.ProvinceID == values.city){
                    myaddress = {
                        ...myaddress,
                        city: item.ProvinceName
                    }
                }
            })
            const addAddress = async () =>{
                    try{
                        var newaddress = await addressService.create(myaddress)
                        myaddress = {
                            ...myaddress,
                            id: parseInt(newaddress.id)
                        }
                        notify('success',"Thêm địa chỉ đặt hàng thành công")
                        formik.values.name = "" 
                        formik.values.phone =  ""
                        formik.values.address =  ""
                        formik.values.city =  ""
                        formik.values.district =   ""
                        formik.values.ward =  ""
                        fetchOrder(myaddress)
                    }
                    catch(error){
                        console.log(error);
                    }
            }
            addAddress()
        }
    });

    useEffect(() => {
        const isDefault = async() =>{
            try{
                const rs = await addressService.isDefault()
                if(rs){
                    document.getElementById('default-address').checked = true
                    document.getElementById('default-address').disabled = true
                }
            }
            catch(error){
                console.log(error);
            }
        }
        isDefault()
    }, []);

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

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let idTPHCM = 1442;
        let districtID;
        let provinceID;

        setInputs(values => ({...values, [name]: value}));

        if (name === 'city' && value !== 0) {
            provinceID = value;
            setIdProvince(provinceID);
            getListDistrict(provinceID);
            formik.values.city = provinceID
        } else if (name === 'district' && value !== 0) {
            districtID = value
            setIdDistrict(districtID);

            getListWard(districtID);
        } else if (name === 'ward' && value !== 0) {
            setIdWard(value);
        }
    }

    useEffect(() => {
        getListProvince();
    }, []);
  return (
    <>
    <AppHeader/>
      <div className="container main">
        <div className="row checkout">
          <div class="col-8 reorder px-3 pb-4">
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
                        <span class="order-price">{currencyFormat(cartitem.price)} x {cartitem.quantity} </span>
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
            <div className="right">
                <button className="app-button" style={{width: '200px'}} onClick={()=>addOrder()}>Đặt hàng</button>
            </div>
          </div>
          <div className="checkout_address col-4 p-4">
                <h5 className="mb-3"><b>Địa chỉ giao hàng</b></h5>
                {
                    mainAddress ? 
                    <div>
                        {mainAddress.name.toUpperCase()}
                            <div>
                            <span>Địa chỉ: </span>
                                {mainAddress.address + ", " + mainAddress.ward + ", " + mainAddress.district + ", " + mainAddress.city}</div>
                            <div>
                            <span>Điện thoại: </span>
                            {mainAddress.phone}</div>
                    </div> : ""
                }
                <div className="checkout_choose_address_btn my-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Chọn địa chỉ giao hàng khác
                </div>

                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Địa chỉ giao hàng</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        {
                            address.map((locate) =>(
                                <div className="checkout_choose_address" onClick={()=>changeAddess(locate)} data-bs-dismiss="modal">
                                <div style={{display:"flex", alignItem: "center"}}>
                                        {locate.name.toUpperCase()}
                                        {
                                            locate.default_value ?
                                            <span className="mx-3 default-address-icon">
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg>
                                                <span className="mx-2 default-address-icon">
                                                    Địa chỉ mặc định
                                                </span> 
                                            </span> 
                                            : ""
                                        }
                                    </div>
                                    <div>
                                        <span>Địa chỉ: </span>
                                        {locate.address + ", " + locate.ward + ", " + locate.district + ", " + locate.city}</div>
                                    <div>
                                        <span>Điện thoại: </span>
                                        {locate.phone}</div>
                                    </div>
                            ))
                        }
                        <span className="checkout_choose_address_btn my-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">Thêm địa chỉ mới</span>
                        </div>
                    </div>
                </div>
                </div>
                <div class="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Địa chỉ giao hàng</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <form action="#" class="info" onSubmit={formik.handleSubmit}>
                            <div className="px-3 pb-5">
                                <h3 className="title">Thêm địa chỉ mới</h3>
                                <div class="field">
                                    <input type="text" class="form-control" name="name"
                                                placeholder="Tên"  value={formik.values.name}
                                                onChange={formik.handleChange} 
                                                className={formik.errors.name && formik.touched.name && "error_input"}/>
                                    {formik.errors.name && formik.touched.name && (
                                            <p className="form_error">{formik.errors.name}</p>
                                        )}
                                </div>
                                <div class="field">
                                    <input type="text" class="form-control" name="phone" 
                                                placeholder="Số điện thoại"  value={formik.values.phone}
                                                onChange={formik.handleChange} 
                                                className={formik.errors.phone && formik.touched.phone && "error_input"}/> 
                                    {formik.errors.phone && formik.touched.phone && (
                                            <p className="form_error">{formik.errors.phone}</p>
                                        )}
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
                                <div class="form-group">
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
                                    <div class="form-group">
                                        <select class="form-control form-select field" name="district" disabled = {listDistrict.length ===0}                            
                                            onChange={formik.handleChange}
                                            onClick={handleChange}
                                            value={formik.values.district}
                                            className={formik.errors.district && formik.touched.district && "error_input"}>
                                        <option defaultValue value="#">Huyện/Quận</option>
                                        {listDistrict.map((item) => {
                                            return (
                                                <option key={item.DistrictID} value={item.DistrictID}>
                                                    {item.DistrictName}
                                                </option>
                                            )
                                        })}
                                        </select> 
                                    </div>
                                    <div class="form-group ">
                                        <select class="form-control form-select field" name="ward" disabled = {listWard.length === 0}
                                            onChange={formik.handleChange}
                                            onClick={handleChange}
                                            value={formik.values.ward}
                                            className={formik.errors.ward && formik.touched.ward && "error_input"}>
                                            <option defaultValue value="#">Xã/Phường</option>
                                            {listWard.map((item) => {
                                                return (
                                                    <option key={item.WardCode} value={item.WardCode}>
                                                        {item.WardName}
                                                    </option>
                                                )
                                            })}
                                        </select> 
                                    </div>
                                    <div className="mt-3">
                                        <input type="checkbox" name="" id="default-address" /> Lưu thành địa chỉ mặc định
                                    </div>
                                    <div className="right">
                                        <button className="app-button" data-bs-dismiss="modal">Lưu</button>
                                    </div>
                                </div>
                            </form> 
                        </div>
                    </div>
                </div>
                </div>
          </div>
        </div> 
      </div>
    <AppFooter/> 
    </>
    )
}

export default CheckOut