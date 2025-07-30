import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.get("/tokens/refresh-token");
                return axiosInstance(originalRequest);
            }
            catch (refreshError) {
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;