import React from "react";
import addressService from "../../services/address.service";
import { useState, useEffect} from "react";

function AccountAddress({setChoose, user, editAddress}){
    const [address, setAddress] = useState([])
    useEffect(()=>{
        const fetchOrder = async() =>{
            try{
                const apiaddress = await addressService.get(user.idUser)
                setAddress(apiaddress)
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder()
    },[address])

    const removeAddress = async (id) =>{
        try{
            const apiaddress = await addressService.delete(id)
        }
        catch(error){
            console.log(error);
        }
    }
    return(
        <>
        <div className="col-9">
            <a className="new-adress center" onClick={()=>setChoose("newaddress")} >
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                <span>Thêm địa chỉ mới</span>
            </a>  
            {
                address.map((locate, index)=>(
                    <>
                        <div className="row user-address">
                            <div className=" col-8">
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
                            <div className="col-4 update-address">
                                    <div onClick={()=>editAddress(locate)}
                                        className='admin-edit-button mx-2'>
                                        <i class="fa-solid fa-pen"></i>
                                    </div>
                                    <div
                                        className='admin-delete-button' onClick = {()=> removeAddress(locate.id)}>
                                        <i className='fas fa-trash'></i>
                                    </div>
                            </div>
                        </div>
                    </>
                ))
            }      
        </div>
        </>
    )
}

export default AccountAddress