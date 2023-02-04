import { useState} from 'react';

function BrandFilter({handleFilters}){
    const brands =[
        {
            id:1,
            name: "NSX Kim Đồng",
            imgUrl: "https://upload.wikimedia.org/wikipedia/vi/3/3b/Logo_nxb_Kim_%C4%90%E1%BB%93ng.png"
        },
        {
            id:2,
            name: "NSX Trẻ",
            imgUrl: "https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/09/12031437/top-7-thiet-ke-logo-nha-xuat-ban-sach-dac-sac-001.png"
        },
        {
            id:3,
            name: "NSX Văn Học",
            imgUrl: "http://bizweb.dktcdn.net/100/370/339/themes/744741/assets/logo.png?1632297125018"
        },
        {
            id:4,
            name: "Nhi Đồng",
            imgUrl: "./giaoduc.png"
        },
        {
            name: "Nhi Đồng",
            imgUrl: "hhttps://vnuhcmpress.edu.vn/wp-content/uploads/2019/04/logo.png"
        },
        {
            id:5,
            name: "NSX Phương Nam",
            imgUrl: "./phuongnam.png"
        }
    ]

    const [Checked, setChecked] = useState([])

    const handleToggle = (value, name) => {

        const currentIndex = Checked.indexOf(name);
        const newChecked = [...Checked];

        if (currentIndex===-1) {
            newChecked.push(name)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        handleFilters('brand',newChecked)
    }
    
      
    return(
        <>
            <div className="category-filter pt-5">
                <h4>Nhà Xuất Bản</h4>
                {
                    brands.map((brand)=>(
                        <div>
                            <input type="checkbox" name="" id="" 
                                onChange={() => handleToggle(brand.id, brand.name)}
                                checked={Checked.indexOf(brand.name) === -1 ? false : true}/>&nbsp;&nbsp;
                            <span>{brand.name}</span>
                        </div> 
                    ))
                }
            </div>
        </>
    )
}

export default BrandFilter;