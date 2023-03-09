import React from "react";
import { useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from 'axios';
import { useLocation } from 'react-router-dom'
import productService from "../../services/product.service";
import { notify } from "../../auth.action";
import { useNavigate } from 'react-router-dom';

function AdminBookDetail({editbook}){
    const book = editbook
    const [selectedImage, setSelectedImage] = useState({
        imgUrl:  book ? book.imageUrl : "",
        changeUrl:  false});
    const navigate = useNavigate()

    var initBook ={
        title: "",
        author: "",
        imageUrl: "",
        price:"",
        category :  "",
        page: 0,
        brand: "",
        language: "",
        releaseDate: "",
        description:""
    }

    if(book !=  null)
        initBook = book

    const uploadFile = () =>{
        let photo = document.getElementById("image-file").files[0];
        let formData = new FormData();
        formData.append("photo", photo);
        var oldImage = book ? book.imageUrl.slice(book.imageUrl.lastIndexOf("/") + 1) : ""
        formData.append("oldImage", oldImage)
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        const uploadImage= async () =>{
            try{
            Axios.post('http://localhost:3001/api/product/upload', formData, config)
                .then(response => {
                    if (response.data.success) {
                    } else {
                        alert('Failed to save the Image in Server')
                    }
                })
            }
            catch(error){
                console.log(error);
            }
        }
        uploadImage()
        if(book != null) 
            formik.values.imageUrl = `http://localhost:3001/images/${photo.name}`
    }

    const formik = useFormik({
        initialValues: initBook,
        validationSchema: Yup.object({
            title :Yup.string().required("Title is required"),
            author:  Yup.string().required("Author is required"),
            // imageUrl:  Yup.string().required("imageUrl is required"),
            price:  Yup.number().required("Price is required"),
            category: Yup.string().required("Category is required"),
            page: Yup.number().required("page is required").positive("Page must be greater than 0 "),
            brand: Yup.string().required("brand is required"),
            language: Yup.string().required("language is required"),
            releaseDate: Yup.string().required("releaseDate is required"),
            description: Yup.string().required("description is required"),
        }),
        onSubmit: values => {
                const updateBook = async () =>{
                    try{
                       await productService.update(values.id, values)
                        notify('success',"Cập nhật sản phẩm thành công")
                    }
                    catch(error){
                        console.log(error);
                    }
                }

                const addBook = async () =>{
                    try{
                       await productService.create(values)
                        notify('success',"Thêm sản phẩm thành công")
                    }
                    catch(error){
                        console.log(error);
                    }
                }

                if(selectedImage.changeUrl)
                    uploadFile()
                book ? updateBook() : addBook()
                navigate('/')
        }
    });

    return(
        <>
            <div className="pt-4">
                <div className="row">
                    <div className="col-4 p-5">
                    <div className="detail-boximg ">
                            <div className="detail-img">
                                {selectedImage.imgUrl != "" ?
                                <img src={selectedImage.imgUrl} alt="" /> 
                                :  <div className="addImage"><label htmlFor="image-file"><i class="fa-solid fa-plus"></i></label></div>}
                            </div>
                    </div>
                            <div>
                                <input className="uploadfile" name="imageUrl" id="image-file" 
                                // value={formik.values.imageUrl}
                                    type="file"
                                        onChange={(event) => {
                                            // uploadFile(
                                                formik.values.imageUrl= URL.createObjectURL(event.target.files[0])
                                                setSelectedImage({
                                                    imgUrl: URL.createObjectURL(event.target.files[0]),
                                                    changeUrl: true})
                                                // formik.handleChange()
                                        }}
                                    />
                                 
                            </div>
                    </div>
                    <div className="admin-form col-8">
                    <form action="#" class="signup info" onSubmit={formik.handleSubmit}>
                        {book ?<h4>Cập nhật sản phẩm</h4>: <h4>Thêm sản phẩm</h4>}
                        <div className="field">
                        <input type="text" class="form-control" name="title"  
                                        placeholder="Tên sách" value={formik.values.title}
                                        onChange={formik.handleChange} 
                                        className={!formik.errors.title ? "": "error_input"}/>
                        {formik.errors.title && formik.touched.title && (
                                    <p className="form_error">{formik.errors.title}</p>
                                )}
                        </div>    
                        <div class="field">
                                <input type="text" class="form-control" name="author" 
                                        placeholder="Tác giả" value={formik.values.author}
                                        onChange={formik.handleChange} 
                                        className={!formik.errors.author ? "": "error_input"}/>
                                {formik.errors.author && formik.touched.author && (
                                    <p className="form_error">{formik.errors.author}</p>
                                )}
                        </div>
                    <div className="row">
                        <div class="field col-6">
                            < input type="text" class="form-control"  name="price"
                                        placeholder="Giá"  value={formik.values.price}
                                        onChange={formik.handleChange} 
                                        className={!formik.errors.price? "": "error_input"}/>
                            {formik.errors.price && formik.touched.price && (
                                    <p className="form_error">{formik.errors.price}</p>
                                )}
                        </div>
                        <div class="field col-6">
                            <input type="text" class="form-control" name="releaseDate" 
                                        placeholder="Năm xuất bản"  value={formik.values.releaseDate}
                                        onChange={formik.handleChange} 
                                        className={!formik.errors.releaseDate? "": "error_input"}/> 
                            {formik.errors.releaseDate && formik.touched.releaseDate && (
                                    <p className="form_error">{formik.errors.releaseDate}</p>
                                )}
                        </div>
                    </div>
                    <div className="row">
                        <div class="field col-6">
                                <input type="text" class="form-control" name="brand" 
                                            placeholder="Nhà xuất bản"  value={formik.values.brand}
                                            onChange={formik.handleChange} 
                                            className={!formik.errors.brand? "": "error_input"}/> 
                                {formik.errors.brand && formik.touched.brand && (
                                        <p className="form_error">{formik.errors.brand}</p>
                                    )}
                        </div>
                        <div class="field col-6">
                                <input type="text" class="form-control" name="language" 
                                            placeholder="Ngôn ngữ"  value={formik.values.language}
                                            onChange={formik.handleChange} 
                                            className={!formik.errors.language? "": "error_input"}/> 
                                {formik.errors.language && formik.touched.language && (
                                        <p className="form_error">{formik.errors.language}</p>
                                    )}
                        </div>
                    </div>
                        <div className="row">
                            <div class="field col-6">
                                    <input type="number" class="form-control" name="page" 
                                            placeholder="Số trang" value={formik.values.page}
                                            onChange={formik.handleChange} 
                                            className={!formik.errors.page? "": "error_input"}/>
                                    {formik.errors.page && formik.touched.page && (
                                        <p className="form_error">{formik.errors.page}</p>
                                    )}
                            </div>
                        <div class="form-group col-6">
                            <select class="form-select form-control field" name="category" 
                                value={formik.values.category}
                                onChange={formik.handleChange}>
                            <option value="TL" selected={ formik.values.category=="TL" ? false : true}> Tâm lý - Kỹ năng sống</option>
                            <option value="MG" selected={ formik.values.category=="MG" ? false : true}>Manga - Comic</option>
                            <option value="SGK" selected={ formik.values.category=="SGK" ? false : true}>Giáo Khoa - Tham Khảo</option>
                            <option value="NN" selected={ formik.values.category=="NN" ? false : true}>Sách Học Ngoại Ngữ</option>
                            <option value="NG" selected={ formik.values.category=="NG" ? false : true}>Sách Nước Ngoài</option>
                            </select>  
                            </div> 
                        </div>
                    <div class="">
                            <textarea type="text"  rows="7" class="form-control" name="description" 
                                        placeholder="Mô tả"  value={formik.values.description}
                                        onChange={formik.handleChange} 
                                        className={!formik.errors.description? "": "error_input"}/> 
                            {formik.errors.description && formik.touched.description && (
                                    <p className="form_error">{formik.errors.description}</p>
                                )}
                    </div>
                    <div class="admin-button">
                            <input type="submit" value="SAVE" className="app-button mt-2" />
                        </div>
                    </form>
                    </div>
                </div>
          </div>
        </>
    )
}

export default AdminBookDetail