import { toast } from "react-toastify";

export const showMassage = {
    success: (msg: string) => toast.success(msg),
    info: (msg: string) => toast.info(msg),
    warning: (msg: string) => toast.warning(msg),
    error: (msg: string) => toast.error(msg),
    
}