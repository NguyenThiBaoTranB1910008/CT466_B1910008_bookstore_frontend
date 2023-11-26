import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userService from "../../services/user.service";
import { notify } from "../../auth.action";
import { useState,useContext , useEffect} from "react";
import axios from "axios";
import AccountAddress from "./AccountAddress";

function AccountInfo({user}){
    const formik = useFormik({
        initialValues: {
            fullname: user.fullname,
            pass: user.pass,
            confirm_pass: "",
        },
        validationSchema: Yup.object({
            fullname: Yup.string()
            .min(2, "Mininum 2 characters")
            .max(15, "Maximum 20 characters")
            .required("Required!"),
            pass: Yup.string()
            .min(5, "Minimum 5 characters")
            .required("Required!"),
            confirm_pass: Yup.string()
            .oneOf([Yup.ref("pass")], "Password's not match")
            .required("Required!"),
        }),
        onSubmit: values => {
            const update= async () =>{
                try{
                    const newuser= {...user, 
                        fullname: values.fullname,
                        pass:values.pass} 
                    await userService.update(newuser)
                    notify("success","Cập nhật thông tin người dùng thành công")
                }
                catch(error){
                    console.log(error);
                }
            }
            update()
        }
    });
    return(
        <>
        <div className="col-9">
        <form action="#" class="info" onSubmit={formik.handleSubmit}>
            <div className="account-info detailbook-info px-5 pb-5">
                <h3 className="title">Thông tin người dùng</h3>
                <div class="field">
                    <input type="text" 
                            name="fullname" placeholder="Fullname"
                            value={formik.values.fullname}
                            onChange={formik.handleChange} 
                            className={formik.errors.fullname && formik.touched.fullname && "error_input"}/>
                    {formik.errors.fullname && formik.touched.fullname && (
                            <p className="form_error">{formik.errors.fullname}</p>)}
                </div>
                <div class="field">
                    <input type="password" name="pass" placeholder="Password" 
                            value={formik.values.pass}
                            onChange={formik.handleChange} 
                            className={formik.errors.pass && formik.touched.pass && "error_input"}/>
                        {formik.errors.pass && formik.touched.pass && (
                                <p className="form_error">{formik.errors.pass}</p>)}
                </div>
                <div class="field">
                    <input type="password" name="confirm_pass" placeholder="Confirm password" 
                            value={formik.values.confirm_pass}
                            onChange={formik.handleChange} 
                            className={formik.errors.confirm_pass && formik.touched.confirm_pass && "error_input"}/>
                            {formik.errors.confirm_pass && formik.touched.confirm_pass && (
                                    <p className="form_error">{formik.errors.confirm_pass}</p>)}
                        </div>
                </div>
        </form>
        </div>
        </>
    )
}

export default AccountInfo