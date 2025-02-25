import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationType = {
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
};



export const FrontendNotification = (message: string, type: any) => {
  const config: any = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "warning":
      toast.warn(message, config);
      break;
    case "info":
      toast.info(message, config);
      break;
    default:
      toast(message, config);
  }
};
