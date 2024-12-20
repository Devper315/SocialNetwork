import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchPrivateConversation = async(friendId) => {
    try {
        const response = await httpClient.get(`${API.CONVERSATION}/friend/${friendId}`, friendId)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy cuộc trò chuyện: ", error.response)
    }
}

export const fetchMyConversations = async(lastUpdate) => {
    try {
        const response = await httpClient.get(API.CONVERSATION, { params: { lastUpdate } })
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu cuộc trò chuyện", error.response)
    }
}

export const fetchConversationById = async(id) => {
    try {
        const response = await httpClient.get(`${API.CONVERSATION}/${id}`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy cuộc trò chuyện theo id", error.response)
    }
}

export const fetchMessagesByConversationId = async(conversationId, lastId) => {
    try {
        const response = await httpClient.get(`${API.MESSAGE}/${conversationId}`, { params: { lastId } })
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu tin nhắn", error)
    }
}

export const fetchUnreadConversationTotal = async() => {
    try {
        const response = await httpClient.get(`${API.CONVERSATION}/unread-total`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu số lượng cuộc trò chuyện chưa đọc", error)
    }
}

export const fetchEmoji = async(lastId) => {
    try {
        const response = await httpClient.get(`${API.CONVERSATION}/emoji`, { params: { lastId } })
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu emoji", error)
    }
}

export const createMessage = async(message) => {
    console.log("Tin nhắn mới", message)
    try {
        const response = await httpClient.post(`${API.CONVERSATION}/message`, message)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi tạo tin nhắn mới", error)
    }
}

export const updateMessageImage = async(message) => {
    try {
        const response = await httpClient.put(`${API.CONVERSATION}/message/update-image`, message)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi cập nhật ảnh cho tin nhắn", error)
    }
}