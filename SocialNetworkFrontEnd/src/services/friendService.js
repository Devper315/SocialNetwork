import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchFriend = async(page, size) => {
    try {
        const params = { page: page - 1, size }
        const response = await httpClient.get(API.FRIEND, { params })
        return response.data
    } catch (error) {
        console.log("Lỗi khi lấy danh sách bạn bè: ", error)
        return []
    }
}

export const searchFriend = async(keyword, page, size) => {
    try {
        const params = { keyword, page: page - 1, size }
        const response = await httpClient.get(API.SEARCH_FRIEND, { params })
        return response.data
    } catch (error) {
        console.log("Lỗi khi tìm kiếm bạn bè: ", error)
    }
}

export const fetchFriendRequest = async(page, size) => {
    try {
        const params = { page: page - 1, size }
        const response = await httpClient.get(API.FRIEND_REQUEST, { params })
        return response.data
    } catch (error) {
        console.log("Lỗi khi lấy yêu cầu kết bạn: ", error)
    }
}

export const createFriendRequest = async(userId) => {
    try {
        const response = await httpClient.post(`${API.FRIEND_REQUEST}/${userId}`)
        return response
    } catch (error) {
        console.log("Lỗi khi gửi yêu cầu kết bạn:", error.response)
    }
}

export const actionFriendRequestByUserId = async(userId, accept) => {
    const params = {
        userId,
        accept
    }
    try {
        const response = await httpClient.delete(API.FRIEND_REQUEST, { params })
        return response
    } catch (error) {
        console.log("Lỗi khi thao tác yêu cầu kết bạn:", error.response)
    }
}

export const unfriend = async(friendId) => {
    try {
        const response = await httpClient.delete(`${API.FRIEND}/${friendId}`)
        return response
    } catch (error) {
        console.log("Lỗi khi hủy kết bạn:", error.response)
    }
}