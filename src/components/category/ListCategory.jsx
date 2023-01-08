import { Link } from "react-router-dom"
function ListCategory(){
    const caterories = [{
        url: "https://salt.tikicdn.com/cache/750x750/ts/product/ab/1e/96/f420ba84603be6a95b8f777d3bf0a5a6.png",
        name: "Tâm Lý - Kỹ Năng Sống",
        kh: "TL"
    },
    {
        url: "https://cdn0.fahasa.com/media/catalog/product/p/o/pokemon---cuoc-phieu-luu-cua-pippi-bw-_black-white_---tap-3.jpg",
        name: "Manga - Comic",
        kh: "MG"
    },
    {
        url: "https://cdn0.fahasa.com/media/catalog/product/8/9/8936214270408.jpg",
        name: "Giáo Khoa - Tham Khảo",
        kh: "SGK"
    },
    {
        url: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935251419641.jpg",
        name: "Sách Học Ngoại Ngữ",
        kh: "NN"
    },
    {
        url: "https://cdn0.fahasa.com/media/wysiwyg/icon-menu/category/foreign-books.png",
        name: "Sách Nước Ngoài",
        kh: "NG"
    }
    ]
    return(
        <div className="caterory py-5">
            {
                caterories.map((caterory,index) => (
                    <div className="caterory-item" key={index}>
                    <Link to='/menu' state={{cate: caterory.kh}}>
                        <img src={caterory.url} alt=""/>
                        <span className="caterory-icon">{caterory.name}</span>
                    </Link>
                    </div>
                ))
            }
        </div>
    )
}

export default ListCategory;