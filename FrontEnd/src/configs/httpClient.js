import axios from "axios";
import { CONFIG } from "./config";

const httpClient = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

httpClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpClient