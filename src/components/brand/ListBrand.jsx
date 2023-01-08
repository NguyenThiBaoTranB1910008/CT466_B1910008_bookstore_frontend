function ListBrand(){
    const brands =[
        {
            name: "Nhi Đồng",
            imgUrl: "https://upload.wikimedia.org/wikipedia/vi/3/3b/Logo_nxb_Kim_%C4%90%E1%BB%93ng.png"
        },
        {
            name: "Nhi Đồng",
            imgUrl: "https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/09/12031437/top-7-thiet-ke-logo-nha-xuat-ban-sach-dac-sac-001.png"
        },
        {
            name: "Nhi Đồng",
            imgUrl: "http://bizweb.dktcdn.net/100/370/339/themes/744741/assets/logo.png?1632297125018"
        },
        {
            name: "Nhi Đồng",
            imgUrl: "./giaoduc.png"
        },
        {
            name: "Nhi Đồng",
            imgUrl: "hhttps://vnuhcmpress.edu.vn/wp-content/uploads/2019/04/logo.png"
        },
        {
            name: "Nhi Đồng",
            imgUrl: "./phuongnam.png"
        }
    ]
    return(
        <div className="brand-list pb-5">
                {
                    brands.map((brand, index)=>(
                        <div className="brand-item" key={index}>
                            <img src={brand.imgUrl} alt=""/>
                           </div>
                    ))
                }
        </div>
    )
}

export default ListBrand;