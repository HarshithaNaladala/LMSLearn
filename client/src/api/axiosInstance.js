import axios from "axios";

const baseURL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000' 
    : 'https://lms-learn-tawny.vercel.app';

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(config => {
    const accesstoken = sessionStorage.getItem('accessToken');

    if(accesstoken) {
        config.headers.Authorization = `Bearer ${accesstoken}`
    }

    return config
},(err)=>Promise.reject(err))

export default axiosInstance;