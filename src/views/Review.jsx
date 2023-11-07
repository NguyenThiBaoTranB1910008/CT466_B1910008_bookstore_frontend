import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userService from "../services/user.service";
import { notify } from "../auth.action";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"

function Review(){
    const location = useLocation()
    console.log(location.state.order)
    return(
        <>
         <h4>Viết nhận xét</h4>
        </>
    )
}
export default Review