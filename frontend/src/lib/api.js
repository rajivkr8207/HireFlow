import axios from "axios";

const api = axios.create({
    baseURL: "https://hireflow-tp0o.onrender.com/api/v1",
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
                await api.get("/auth/refresh-token");
                return api(originalReq);
            } catch (error) {
                window.location.href = "/";
                return Promise.reject(error);
            }
        }
    }
);


export default api;
