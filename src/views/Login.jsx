import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userService from "../services/user.service";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from "../store/Context";
import { notify } from "../auth.action";
import { Link } from "react-router-dom";
import { useState } from "react";
import cartService from "../services/cart.service";
import announceService from "../services/announce.service";

function Login(){ 
    const navigate = useNavigate()
    const [state,dispatch] = useContext(Context)
    const [number, setNumber] = useState(0)
    const formik = useFormik({
        initialValues: {
            accname: "",
            pass: "",
            remember: true,
        },
        validationSchema: Yup.object({
            accname: Yup.string()
                .required("Required!"),
            pass: Yup.string()
                .min(5, "Minimum 5 characters")
                .required("Required!"),
        }),
        onSubmit: values => {
            const loginCheck = async () =>{
                try{
                    const trueUser = await userService.loginCheck(values)
                    if(trueUser){
                          var cart = await cartService.getAll(values.accname)
                          var newnotify1 = await announceService.newNotify(values.accname)
                          var seen = []
                          newnotify1.map((announment)=>{
                            seen.push(announment.id)
                        })
                        dispatch({
                            type: "login",
                            name: trueUser.accname,
                            id: trueUser.idUser,
                            cartItem: cart.length,
                            newNotify: seen,
                            isAdmin: trueUser.isadmin
                        })
                        if(values.remember){
                            localStorage.setItem("user", values.accname )
                        }
                        notify('success',"Đăng nhập thành công")
                        if(trueUser.accname ==="admin")
                            navigate("/admin")
                        else    
                            navigate("/")
                      }
                      else{
                          notify('error',"Tên đăng nhập hoặc mật khẩu không đúng")
                      }
                }
                catch(error){
                   console.log(error);
                }
            }
            loginCheck()
          }
      });

    return(
        <>
        <div id="signup">
            <div className="wrapper">
                <div class="title-text">
                    <div class="title signup"> Login Form </div>
             </div>
                <form action="#" class="signup" onSubmit={formik.handleSubmit}>
                    <div class="field">
                        <input type="text" name="accname" 
                                placeholder="Account name" 
                                value={formik.values.accname}
                                onChange={formik.handleChange} 
                                className={formik.errors.accname && formik.touched.accname && "error_input"}/>
                         {formik.errors.accname && formik.touched.accname && (
                            <p className="form_error">{formik.errors.accname}</p>
                        )}
                    </div>
                    <div class="field">
                        <input type="password" name="pass" 
                                placeholder="Password" 
                                value={formik.values.pass}
                                onChange={formik.handleChange} 
                                className={formik.errors.pass && formik.touched.pass && "error_input"}/>
                        {formik.errors.pass && formik.touched.pass && (
                            <p className="form_error">{formik.errors.pass}</p>
                        )}
                    </div>
                    <div className="pt-2">
                        <input type="checkbox" name="remember" checked = {formik.values.remember} value={formik.values.remember} onChange={formik.handleChange} /> Remember me
                    </div>
                    <div class="field btn mt-2">
                        <input type="submit" value="Login"/>
                    </div>
                </form>
                <Link to="/signup"><p class="loginAndnSigUp">Don't have an account? Create now</p></Link>
            </div>
        </div>
    </>
    )
}
export default Login
