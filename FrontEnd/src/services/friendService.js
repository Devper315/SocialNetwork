import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const fetchFriend = async () => {
    try{
        const response = await httpClient.get(API.FRIEND)
        const friends = response.data.result.map(friend => 
            ({
                ...friend,
                fullName: friend.firstName + " " + friend.lastName
            })
        )
        return friends
    }
    catch(error){
        console.log("Lỗi khi lấy danh sách bạn bè: ", error.response)
    }
}