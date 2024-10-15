import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const login = async (form) => {
    return await httpClient.post(API.LOGIN, form)
}

export const register = async (form) => {
    return await httpClient.post(API.REGISTER, form)
}

export const fetchFriends = async () => {
    try {
        const response = await httpClient.get(API.FRIEND)
        return response
    } catch (error) {
        console.log("Lỗi khi lấy danh sách bạn:", error.response)
    }
}

export const createFriendRequest = async (userId) => {
    try {
        const response = await httpClient.post(`${API.FRIEND}/${userId}`)
        return response
    } catch (error) {
        console.log("Lỗi khi gửi yêu cầu kết bạn:", error.response)
    }

}