import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    timeout: 15000000,
    withCredentials: true,
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        let originalReq = error.config;
        if (error.response.status === 401 && !originalReq.retry) {
            originalReq.retry = true;
            try {
                await api.post("/auth/refresh-token");
                return api(originalReq);
            } catch (error) {
                window.location.href = "/";
                return Promise.reject(error);
            }
        }
    }
);


export default api;
