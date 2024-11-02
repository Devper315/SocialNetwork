import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchGroup = async (keyword, page) => {
    const params = { keyword, page }
    try {
        const response = await httpClient.get(API.GROUP, { params })
        console.log(response.data.result)
        return response.data.result
    }
    catch (error) {
        console.log("Lỗi khi lấy dữ liệu nhóm", error)
    }
}