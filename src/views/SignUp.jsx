import React from "react";
import { useState,useContext , useEffect} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userService from "../services/user.service";
import { notify } from "../auth.action";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp(){
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            fullname: "",
            accname: "",
            phone: "",
            pass: "",
            confirm_pass: ""
        },
        validationSchema: Yup.object({
            fullname: Yup.string()
            .min(2, "Mininum 2 characters")
            .max(15, "Maximum 20 characters")
            .required("Required!"),
          accname: Yup.string()
            .required("Required!"),
            phone: Yup.string()
            .required("Required!"),
          pass: Yup.string()
            .min(5, "Minimum 5 characters")
            .required("Required!"),
          confirm_pass: Yup.string()
            .oneOf([Yup.ref("pass")], "Password's not match")
            .required("Required!"),
            
        }),
        onSubmit: values => {
            const check= async ()=>{
                try{
                  const ExitUser = await userService.checkAcc(values.accname)
                    if(ExitUser)
                        notify('error',"Tên tài khoản đã tồn tại trên hệ thống")
                    else{
                        await userService.create(values)
                        notify("success","Đăng ký thành công")
                        navigate("/login")
                    }
                }
                catch(error){
                  console.log(error);
                }
            }
            check()
          }
      });

    return(
        <>
        <div id="signup">
            <div className="wrapper">
                <div class="title-text">
                    <div class="title signup"> Signup Form </div>
                </div>
                <form action="#" class="signup" onSubmit={formik.handleSubmit}>
                    <div class="field">
                        <input type="text" 
                                name="fullname" placeholder="Full name" 
                                value={formik.values.fullname}
                                onChange={formik.handleChange} 
                                className={formik.errors.fullname && formik.touched.fullname && "error_input"}/>
                        {formik.errors.fullname && formik.touched.fullname && (
                            <p className="form_error">{formik.errors.fullname}</p>
                        )}
                    </div>
                    <div class="field">
                        <input type="text" name="accname" placeholder="Account name" 
                                value={formik.values.accname}
                                onChange={formik.handleChange} 
                                className={formik.errors.accname && formik.touched.accname && "error_input"}/>
                         {formik.errors.accname && formik.touched.accname && (
                            <p className="form_error">{formik.errors.accname}</p>
                        )}
                    </div>
                    <div class="field">
                        <input type="text" name="phone" placeholder="Phone" 
                                value={formik.values.phone}
                                onChange={formik.handleChange} 
                                className={formik.errors.phone && formik.touched.phone && "error_input"}/>
                         {formik.errors.phone && formik.touched.phone && (
                            <p className="form_error">{formik.errors.phone}</p>
                        )}
                    </div>
                    <div class="field">
                        <input type="password" name="pass" placeholder="Password" 
                                value={formik.values.pass}
                                onChange={formik.handleChange} 
                                className={formik.errors.pass && formik.touched.pass && "error_input"}/>
                        {formik.errors.pass && formik.touched.pass && (
                            <p className="form_error">{formik.errors.pass}</p>
                        )}
                    </div>
                    <div class="field">
                        <input type="password" name="confirm_pass" placeholder="Confirm password" 
                                value={formik.values.confirm_pass}
                                onChange={formik.handleChange} 
                                className={formik.errors.confirm_pass && formik.touched.confirm_pass && "error_input"}/>
                        {formik.errors.confirm_pass && formik.touched.confirm_pass && (
                            <p className="form_error">{formik.errors.confirm_pass}</p>
                        )}
                    </div>
                    <div class="field btn">
                        <input type="submit" value= "Signup"/>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}
export default SignUp