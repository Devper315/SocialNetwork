import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchMyNotifications = async(lastId) => {
    try {
        const response = await httpClient.get(API.NOTIFICATION, { params: { lastId } })
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy thông báo", error.response.data)
    }
}

export const fetchUnreadNotificationTotal = async() => {
    try {
        const response = await httpClient.get(`${API.NOTIFICATION}/unread-total`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu số lượng thông báo chưa đọc", error)
    }
}


export const markAsRead = async(id) => {
    try {
        httpClient.patch(`${API.NOTIFICATION}/${id}`)
    } catch (error) {
        console.log("Lỗi khi đánh dấu đã đọc thông báo", error.response.data)
    }
}