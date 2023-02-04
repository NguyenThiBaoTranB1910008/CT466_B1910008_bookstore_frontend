import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const notify = (type, message) => 
  {
    var css = {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }

    if(type === "success")
      toast.success(message,css);
    if(type === "warning")
      toast.warning(message,css);
    if(type === "error")
      toast.error(message,css);

}

export const currencyFormat= (money) => {
    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9}
    const formated = new Intl.NumberFormat('vi-VN', config).format(money);
    return formated;
}
