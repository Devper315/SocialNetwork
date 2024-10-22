import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchFriend = async (page) => {
    try{
        const params = {page: page - 1}
        const response = await httpClient.get(API.FRIEND, {params})
        return response.data
    }
    catch(error){
        console.log("Lỗi khi lấy danh sách bạn bè: ", error)
    }
}

export const searchFriend = async (keyword, page) => {
    try{
        page -= 1
        const params = {keyword, page}
        const response = await httpClient.get(API.SEARCH_FRIEND, {params})
        return response.data
    }
    catch(error){
        console.log("Lỗi khi tìm kiếm bạn bè: ", error)
    }
}

export const fetchFriendRequest = async (page) => {
    try{
        page -= 1
        const params = {page}
        const response = await httpClient.get(API.FRIEND_REQUEST, {params})
        return response.data
    }
    catch(error){
        console.log("Lỗi khi lấy yêu cầu kết bạn: ", error)
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