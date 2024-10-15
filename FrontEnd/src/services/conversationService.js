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