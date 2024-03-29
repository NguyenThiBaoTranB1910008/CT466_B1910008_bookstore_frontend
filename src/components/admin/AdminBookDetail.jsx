import { React, useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import productService from "../../services/product.service";
import { notify } from "../../auth.action";

function AdminBookDetail({editbook, setAdminChoose}){
    const book = editbook
    const [selectedImage, setSelectedImage] = useState({
        imgUrl:  book ? book.imageUrl : "",
        changeUrl:  false});

    var initBook ={
        title: "",
        author: "",
        imageUrl: "",
        price:"",
        category :  "",
        quantity: "",
        page: 0,
        brand: "",
        language: "",
        releaseDate: "",
        size:"",
        type: "",
        description:"",
        highlight1: "",
        highlight2: "",
        highlight3: ""
    }

    if(book !==  null)
        initBook = book

    const uploadImage= async (formData, config) =>{
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
    
    const uploadFile = () =>{
        let photo = document.getElementById("image-file").files[0];
        let formData = new FormData();
        formData.append("photo", photo);
        var oldImage = book ? book.imageUrl.slice(book.imageUrl.lastIndexOf("/") + 1) : ""
        formData.append("oldImage", oldImage)
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        uploadImage(formData,config)
        formik.values.imageUrl = `http://localhost:3001/images/${photo.name}`
    }

    const updateBook = async (values) =>{
        try{
           await productService.update(values.id, values)
           notify('success',"Cập nhật sản phẩm thành công")
           setAdminChoose("book")
        }
        catch(error){
            console.log(error);
        }
    }

    const addBook = async (values) =>{
        try{
          var isUnique =  await productService.isUnique({title: values.title})
          if(!isUnique){
            notify('error',"Sản phẩm đã có trong kho. Vui lòng nhập sản phẩm khác")
          }
          else{
           await productService.create(values)
           notify('success',"Thêm sản phẩm thành công")
           setAdminChoose("book")
          }
        }
        catch(error){
            console.log(error);
        }
    }

    const formik = useFormik({
        initialValues: initBook,
        validationSchema: Yup.object({
            title :Yup.string().required("Title is required"),
            author:  Yup.string().required("Author is required"),
            // imageUrl:  Yup.string().required("imageUrl is required"),
            price:  Yup.number().required("Price is required"),
            quantity:  Yup.number().required("Quantity is required"),
            category: Yup.string().required("Category is required"),
            page: Yup.number().required("page is required").positive("Page must be greater than 0 "),
            brand: Yup.string().required("brand is required"),
            language: Yup.string().required("language is required"),
            releaseDate: Yup.string().required("releaseDate is required"),
            size: Yup.string().required("Size is required"),
            type: Yup.string().required("Type is required"),
            highlight1: Yup.string().required("Highlight1 is required"),
            highlight2: Yup.string().required("Highlight2 is required"),
            highlight3: Yup.string().required("Highlight3 is required"),
            description: Yup.string().required("description is required")
        }),
        onSubmit: values => {
            if(selectedImage.changeUrl)
                uploadFile()
            book ? updateBook(values) : addBook(values)
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
                                :  <img src="https://cdn.gramedia.com/uploads/highlighted_menu/Icon_category_Buku_Baru__w100_hauto.png" style={{padding: "60px 50px"}}></img>}
                            </div>
                    </div>
                            <div>
                                <input className="uploadfile" name="imageUrl" id="image-file" 
                                // value={formik.values.imageUrl}
                                    type="file"
                                    accept="image/*"
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
                        {/* {book ?<h4>Cập nhật sản phẩm</h4>: <h4>Thêm sản phẩm</h4>} */}
                        <div className="field">
                        <input type="text" class="form-control" name="title"  
                                        placeholder="Tên sách" value={formik.values.title}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.title && formik.touched.title &&  "error_input"}/>
                        {formik.errors.title && formik.touched.title &&  (
                                    <p className="form_error">{formik.errors.title}</p>
                                )}
                        </div>    
                    <div className="row">
                        <div class="field col-6">
                                <input type="text" class="form-control" name="author" 
                                        placeholder="Tác giả" value={formik.values.author}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.author && formik.touched.author && "error_input"}/>
                                {formik.errors.author && formik.touched.author && (
                                    <p className="form_error">{formik.errors.author}</p>
                                )}
                        </div>
                        <div class="field col-6">
                                <input type="number" class="form-control" name="quantity" 
                                        placeholder="Số lượng" value={formik.values.quantity}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.quantity && formik.touched.quantity && "error_input"}/>
                                {formik.errors.quantity && formik.touched.quantity && (
                                    <p className="form_error">{formik.errors.quantity}</p>
                                )}
                        </div>
                    </div>
                    <div className="row">
                        <div class="field col-6">
                            < input type="text" class="form-control"  name="price"
                                        placeholder="Giá"  value={formik.values.price}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.price && formik.touched.price && "error_input"}/>
                            {formik.errors.price && formik.touched.price && (
                                    <p className="form_error">{formik.errors.price}</p>
                                )}
                        </div>
                        <div class="field col-6">
                            <input type="text" class="form-control" name="releaseDate" 
                                        placeholder="Năm xuất bản"  value={formik.values.releaseDate}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.releaseDate && formik.touched.releaseDate && "error_input"}/> 
                            {formik.errors.releaseDate && formik.touched.releaseDate && (
                                <p className="form_error">{formik.errors.releaseDate}</p>
                                )}
                        </div>
                    </div>
                    <div className="row">
                        {/* <div class="field col-6">
                                <input type="text" class="form-control" name="brand" 
                                            placeholder="Nhà xuất bản"  value={formik.values.brand}
                                            onChange={formik.handleChange} 
                                            className={formik.errors.brand && formik.touched.brand && "error_input"}/> 
                                {formik.errors.brand && formik.touched.brand && (
                                        <p className="form_error">{formik.errors.brand}</p>
                                    )}
                        </div> */}
                        <div class=" col-6">
                            <select class="form-select form-control field" name="brand" 
                                    value={formik.values.brand}
                                    onChange={formik.handleChange}>
                                <option value="" selected={ formik.values.brand==="" ? false : true}>Nhà xuất bản</option>
                                <option value="NXB Kim Đồng" selected={ formik.values.brand==="NXB Kim Đồng" ? false : true}>NXB Kim Đồng</option>
                                <option value="NXB Trẻ" selected={ formik.values.brand==="NXB Trẻ" ? false : true}>NXB Trẻ</option>
                                <option value="NXB Giáo dục" selected={ formik.values.brand==="NXB Giáo dục" ? false : true}>NXB Giáo dục</option>
                                <option value="NXB Đại học Cần Thơ" selected={ formik.values.brand==="NXB Đại học Cần Thơ" ? false : true}>NXB Đại học Cần Thơ</option>
                                <option value="NXB Phương Nam" selected={ formik.values.brand==="NXB Phương Nam" ? false : true}>NXB Phương Nam</option>
                                <option value="NXB Văn Học" selected={ formik.values.brand==="NXB Văn Học" ? false : true}>NXB Văn Học</option>
                            </select>  
                            </div> 
                        <div class="field col-6">
                                <input type="text" class="form-control" name="language" 
                                            placeholder="Ngôn ngữ"  value={formik.values.language}
                                            onChange={formik.handleChange} 
                                            className={formik.errors.language && formik.touched.language && "error_input"}/> 
                                {formik.errors.language && formik.touched.language && (
                                        <p className="form_error">{formik.errors.language}</p>
                                    )}
                        </div>
                    </div>
                    <div className="row">
                        <div class="field col-6">
                                <input type="text" class="form-control" name="size" 
                                            placeholder="Kích thước"  value={formik.values.size}
                                            onChange={formik.handleChange} 
                                            className={formik.errors.size && formik.touched.size && "error_input"}/> 
                                {formik.errors.size && formik.touched.size && (
                                        <p className="form_error">{formik.errors.size}</p>
                                    )}
                        </div>
                        <div class="field col-6">
                                <input type="text" class="form-control" name="type" 
                                            placeholder="Loại bìa"  value={formik.values.type}
                                            onChange={formik.handleChange} 
                                            className={formik.errors.type && formik.touched.type && "error_input"}/> 
                                {formik.errors.type && formik.touched.type && (
                                        <p className="form_error">{formik.errors.type}</p>
                                    )}
                        </div>
                    </div>
                        <div className="row">
                            <div class="field col-6">
                                    <input type="number" class="form-control" name="page" 
                                            placeholder="Số trang" value={formik.values.page}
                                            onChange={formik.handleChange} 
                                            className={formik.errors.page && formik.touched.page && "error_input"}/>
                                    {formik.errors.page && formik.touched.page && (
                                        <p className="form_error">{formik.errors.page}</p>
                                    )}
                            </div>
                        <div class="form-group col-6">
                            <select class="form-select form-control field" name="category" 
                                value={formik.values.category}
                                onChange={formik.handleChange}>
                            <option value="TL" selected={ formik.values.category==="TL" ? false : true}> Tâm lý - Kỹ năng sống</option>
                            <option value="MG" selected={ formik.values.category==="MG" ? false : true}>Manga - Comic</option>
                            <option value="SGK" selected={ formik.values.category==="SGK" ? false : true}>Giáo Khoa - Tham Khảo</option>
                            <option value="NN" selected={ formik.values.category==="NN" ? false : true}>Sách Học Ngoại Ngữ</option>
                            <option value="NG" selected={ formik.values.category==="NG" ? false : true}>Sách Nước Ngoài</option>
                            </select>  
                            </div> 
                        </div>
                        <div className="field">
                        <input type="text" class="form-control" name="highlight1"  
                                        placeholder="Đặc điểm nổi bật 1" value={formik.values.highlight1}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.highlight1 && formik.touched.highlight1 &&  "error_input"}/>
                        {formik.errors.highlight1 && formik.touched.highlight1 &&  (
                                    <p className="form_error">{formik.errors.highlight1}</p>
                                )}
                        </div>
                        <div className="field">
                        <input type="text" class="form-control" name="highlight2"  
                                        placeholder="Đặc điểm nổi bật 2" value={formik.values.highlight2}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.highlight2 && formik.touched.highlight2 &&  "error_input"}/>
                        {formik.errors.highlight2 && formik.touched.highlight2 &&  (
                                    <p className="form_error">{formik.errors.highlight2}</p>
                                )}
                        </div>    
                        <div className="field">
                        <input type="text" class="form-control" name="highlight3"  
                                        placeholder="Đặc điểm nổi bật 3" value={formik.values.highlight3}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.highlight3 && formik.touched.highlight3 &&  "error_input"}/>
                        {formik.errors.highlight3 && formik.touched.highlight3 &&  (
                                    <p className="form_error">{formik.errors.highlight3}</p>
                                )}
                        </div>        
                    <div class="">
                            <textarea type="text"  rows="10" class="form-control" name="description" 
                                        placeholder="Mô tả"  value={formik.values.description}
                                        onChange={formik.handleChange} 
                                        className={formik.errors.description && formik.touched.description && "error_input"}/> 
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