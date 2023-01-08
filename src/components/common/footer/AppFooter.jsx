import { Link } from "react-router-dom"
function AppFooter(){
    return(
    <>
        <div>
             <div className="container">
             <footer className="row text-start py-3">
                    <div className="col-6 caterory-title ">
                        <h2>Thông tin liên hệ</h2>
                        <p>Địa chỉ: Đường 3/2, phường Xuân Khánh, Quận Ninh Kiều, thành phố Cần Thơ</p>
                        <p>Holine: 0909 89 12 62</p>
                    </div>
                    <div className="col-6 footer-right caterory-title">
                        <h2 id="title">Nhà sách TBOOK</h2>
                        <p>Sứ mệnh của chúng tôi là mang đến cho khách hàng những cuốn sách với nội dung hay và giá cả hợp lí, nhà sách sẽ ngày càng phát triển mạnh mẽ và ngày càng phát triền vưng mạnh và đáp ứng nhu cầu đọc sách truyền thống cũng như việc đọc sách điện tử ngày càng đồi mới và hiện đại hơn!</p>
                    </div>
                </footer>
            </div> 
            <div className="footer">
                <div className="container">
                    <div className="footer-nav" >
                        <Link className="navbar-brand">
                            <img src="https://www.gramedia.com/assets/gramedia-icon-2.png" alt="" className=""></img>
                        </Link>
                        <div className="caterory-title">
                            <h2 className="m-0 logan">Lấy cảm hứng và bắt đầu truyền cảm hứng</h2>
                        </div>
                        <div className="social">
                            <Link to="https://www.instagram.com">
                                <img src="https://www.gramedia.com/assets/social-icon/instagram.png" alt=""></img>
                            </Link>
                            <Link to="https://www.twitter.com">
                                <img src="https://www.gramedia.com/assets/social-icon/twitter.png" alt=""></img>
                            </Link>
                            <Link to="https://www.facebook.com">
                                <img src="https://www.gramedia.com/assets/social-icon/facebook.png" alt=""></img>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default AppFooter;
