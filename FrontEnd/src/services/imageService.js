import { API } from "../configs/config";
import httpClient from "../configs/httpClient";

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await httpClient.post(`${API.IMAGE}/upload`, formData)
        return response.data.url;
    } catch (error) {
        console.error('Failed to upload image:', error.response ? error.response.data : error.message);

        throw error;
    }
};

export { uploadImage };
