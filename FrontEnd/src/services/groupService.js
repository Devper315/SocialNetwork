import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const createGroup = async (form) => {
    try{
        const response = await httpClient.post(API.GROUP, form)
        console.log(response.data.result)
        return response
    }
    catch(error){
        console.log("Lỗi khi tạo nhóm", error)
    }
}

export const fetchGroups = async (page, keyword) => {
    const params = { keyword, page: page - 1 }
    try {
        const response = await httpClient.get(API.GROUP, { params })
        return response.data.result
    }
    catch (error) {
        console.log("Lỗi khi lấy dữ liệu nhóm", error)
    }
}

export const fetchMyGroups = async (page, keyword) => {
    const params = { keyword, page: page - 1 }
    try {
        const response = await httpClient.get(`${API.GROUP}/my`, { params })
        return response.data.result
    }
    catch (error) {
        console.log("Lỗi khi lấy dữ liệu nhóm của tôi", error)
    }
}

export const fetchGroupById = async (id) => {
    try{
        const response = await httpClient.get(`${API.GROUP}/detail/${id}`)
        return response.data.result
    }
    catch(error){
        console.log("Lỗi khi lấy dữ liệu chi tiết nhóm", error)
    }
}

export const updateGroup = async(form) => {
    try{
        const response = await httpClient.put(API.GROUP, form)
        return response
    }
    catch(error){
        console.log("Lỗi khi cập nhật nhóm", error)
    }
} 