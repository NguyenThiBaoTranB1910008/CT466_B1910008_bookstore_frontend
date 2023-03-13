import { Link } from "react-router-dom"
function AppFooter(){
    return(
    <>
        <div>
            <div className="connect">
                <div className="container">
                    <div className="row">
                    <div className="caterory-title col-4 pt-3">
                        <h2>Đăng ký nhận thông báo mới</h2>
                    </div>
                    <div className="input-group mb-3 col-8">
                        <input type="text" className="form-control connect-input" placeholder="Nhập email để kết nối với chúng tôi" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                        <span className="input-group-text" id="connect-button">Đăng ký</span>
                    </div>
                    </div>
                </div>
          </div>
             <div className="container">
             <footer className="row text-start py-3">
                    <div className="col-6 caterory-title ">
                        <p>Địa chỉ: Đường 3/2, phường Xuân Khánh, Quận Ninh Kiều, thành phố Cần Thơ</p>
                        <p>Holine: 0909 89 12 62</p>
                    </div>
                    <div className="col-6 footer-right caterory-title">
                        <p>Sứ mệnh của chúng tôi là mang đến cho khách hàng những cuốn sách với nội dung hay và giá cả hợp lí, nhà sách sẽ ngày càng phát triển vững mạnh và đáp ứng nhu cầu ngày càng đổi mới và hiện đại hơn!</p>
                    </div>
                </footer>
            </div> 
            <div className="footer">
                <div className="container">
                    <div className="footer-nav" >
                        <Link className="navbar-brand" to="/">
                            <img src="./book1.png" alt="" className="logo"/>
                            <img src="./name1.png" />
                        </Link>
                        <div className="caterory-title">
                            <h2 className="m-0 logan">Lấy cảm hứng và bắt đầu truyền cảm hứng</h2>
                        </div>
                        <div className="social">
                            <a href="https://www.instagram.com">
                                <img src="https://www.gramedia.com/assets/social-icon/instagram.png" alt=""></img>
                            </a>
                            <a href="https://www.twitter.com">
                                <img src="https://www.gramedia.com/assets/social-icon/twitter.png" alt=""></img>
                            </a>
                            <a href="https://www.facebook.com">
                                <img src="https://www.gramedia.com/assets/social-icon/facebook.png" alt=""></img>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default AppFooter;
