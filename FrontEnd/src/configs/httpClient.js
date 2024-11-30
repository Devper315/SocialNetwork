import axios from "axios";
import { CONFIG } from "./config";

const httpClient = axios.create({
    baseURL: CONFIG.BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

httpClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
        }
    }
    return config;
});

httpClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem("token")
            window.location.href = '/'
        }
    }
)

export default httpClient