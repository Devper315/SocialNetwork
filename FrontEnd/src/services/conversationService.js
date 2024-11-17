import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchPrivateConversation = async (friendId) => {
    try{
        const response = await httpClient.get(`${API.CONVERSATION}/${friendId}`, friendId)
        return response.data.result
    }
    catch(error){
        console.log("Lỗi khi lấy cuộc trò chuyện: ", error.response)
    }
}

export const fetchMyConversations = async (lastUpdate) => {
    try{
        const response = await httpClient.get(API.CONVERSATION, {params: {lastUpdate}})
        return response.data.result
    }
    catch(error){
        console.log("Lỗi khi lấy dữ liệu cuộc trò chuyện", error.response)
    }
}

export const fetchMessagesByConversationId = async (conversationId, lastId) => {
    try{
        const response = await httpClient.get(`${API.MESSAGE}/${conversationId}`, {params: {lastId}})
        return response.data.result
    }
    catch(error){
        console.log("Lỗi khi lấy dữ liệu tin nhắn", error)
    }
}