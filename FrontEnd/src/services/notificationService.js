import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchMyNotifications = async (page) => {
    try{
        const params = {page: page - 1}
        const response = await httpClient.get(API.NOTIFICATION, {params})
        return response.data.result
    }
    catch(error){
        console.log("Lỗi khi lấy thông báo", error.response.data)
    }
}

export const markAsRead = async(id) => {
    try{
        httpClient.patch(`${API.NOTIFICATION}/${id}`)
    }
    catch(error){
        console.log("Lỗi khi đánh dấu đã đọc thông báo", error.response.data)
    }
}