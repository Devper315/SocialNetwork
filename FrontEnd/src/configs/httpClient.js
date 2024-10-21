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

export default httpClient