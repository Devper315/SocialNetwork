import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchGroup = (keyword, page) => {
    const params = { keyword, page }
    try {
        const response = httpClient.get(API.GROUP, { params })
        return response.data
    }
    catch (error) {
        console.log("Lỗi khi lấy dữ liệu nhóm", error.response.data)
    }
}