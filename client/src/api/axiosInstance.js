import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://lms-learn-git-main-harshitha-naladalas-projects.vercel.app/',
});

axiosInstance.interceptors.request.use(config => {
    const accesstoken = sessionStorage.getItem('accessToken');

    if(accesstoken) {
        config.headers.Authorization = `Bearer ${accesstoken}`
    }

    return config
},(err)=>Promise.reject(err))

export default axiosInstance;