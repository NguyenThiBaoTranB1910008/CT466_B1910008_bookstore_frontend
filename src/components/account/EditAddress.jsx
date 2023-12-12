import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import addressService from "../../services/address.service";
import { notify } from "../../auth.action";
import { useState, useContext , useEffect} from "react";
import axios from "axios";
import Context from "../../store/Context";

function EditAddress({setChoose, user, locate}){
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
    const [state, dispatch] = useContext(Context) 
    
    const formik = useFormik({
        initialValues: {
            name: locate.name ? locate.name : user.fullname ,
            phone: locate.phone ? locate.phone : user.phone,
            address: locate.address ? locate.address : "",
            city: locate.city ? locate.cityId : "",
            district: locate.district ? locate.districtId : "",
            ward: locate.ward ? locate.wardId : ""
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
            const updateAddress = async () =>{
                try{
                    await addressService.update(locate.id,myaddress)
                    notify('success',"Cập nhật địa chỉ đặt hàng thành công")
                    setChoose('address')
                }
                    catch(error){
                    console.log(error);
                }
        }
        updateAddress()
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
        setIdProvince(locate.cityId);
        getListDistrict(locate.cityId)
        getListWard(locate.districtId)
        setIdDistrict(locate.districtId)
        setIdWard(locate.wardId)
        if(locate.default_value){
            document.getElementById('default-address').checked = true;
            document.getElementById('default-address').disabled = true;
        }
    }, []);
    return(
        <>
        <div className="col-9">       
        <form action="#" class="info" onSubmit={formik.handleSubmit}>
            <div className="account-info detailbook-info px-5 pb-5">
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
                        <input type="checkbox" name="" id="default-address"/> Lưu thành địa chỉ mặc định
                    </div>
                    <div className="right">
                        <button className="app-button" >Lưu</button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default EditAddress