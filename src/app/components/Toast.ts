import {Slide, toast} from "react-toastify";

const showErrorToast = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        transition: Slide,
        draggable: true,
        theme: "colored",
    });
};

const showSuccessToast = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
        theme: "colored",
    });
};

export {showErrorToast, showSuccessToast}