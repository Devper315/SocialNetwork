import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchProfileById = async (id) => {
    try {
        const response = await httpClient.get(`${API.PROFILE}/${id}`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy profile", error.response)
    }
}