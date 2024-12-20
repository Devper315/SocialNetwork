import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const createGroup = async(form) => {
    try {
        const response = await httpClient.post(API.GROUP, form)
        console.log(response.data.result)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const fetchGroups = async(keyword, page, size) => {
    const params = { keyword, page: page - 1, size }
    try {
        const response = await httpClient.get(API.GROUP, { params })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const fetchMyGroups = async(keyword, page, size) => {
    const params = { keyword, page: page - 1, size }
    try {
        const response = await httpClient.get(`${API.GROUP}/my`, { params })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const fetchGroupById = async(id) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/detail/${id}`)
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const fetchUserGroupContext = async(groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/context/${groupId}`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu context", error)
    }
}

export const updateGroup = async(updatedGroup) => {
    try {
        const response = await httpClient.put(API.GROUP, updatedGroup)
        return response
    } catch (error) {
        console.log("Lỗi khi sửa group", error)
    }
}

export const addGroupMember = async(groupId, userId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/add-member`, null, {
            params: { groupId, userId }
        })
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const removeGroupMember = async(groupId, userId) => {
    try {
        const response = await httpClient.delete(`${API.GROUP}/remove-member`, {
            params: { groupId, userId }
        })
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}
export const leaveGroup = async(groupId) => {
    try {
        const response = await httpClient.delete(`${API.GROUP}/leave-group`, {
            params: { groupId }
        })
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const fetchGroupMembers = async(groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/members/${groupId}`)
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const createGroupRequest = async(groupId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/requests/${groupId}`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi gửi yêu cầu tham gia nhóm", error)
    }
}

export const fetchGroupJoinRequests = async(groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/requests/${groupId}/admin-requests`)
        return response.data
    } catch (error) {
        console.log("Lỗi khi lấy yêu cầu tham gia nhóm", error)
    }
}


export const actionGroupRequest = async(requestId, accept) => {
    const params = { requestId, accept }
    try {
        const response = await httpClient.put(`${API.GROUP}/requests/action/`, { params })
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi thao tác yêu cầu tham gia nhóm")
    }
}


export const changeRole = async(groupId, userId, roleId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/change-role/${groupId}/${userId}/${roleId}`)
        return response.data.result
    } catch (error) {
        console.error("Lỗi khi thay đổi vai trò:", error)
    }
}

export const changeCreateUserId = async(groupId, userId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/change-createUserId/${groupId}/${userId}`)
        return response.data.result
    } catch (error) {
        console.error("Lỗi khi thay đổi vai trò:", error)
        throw new Error("Không thể thay đổi vai trò của thành viên!")
    }
}
export const dissolve = async(groupId) => {
    try {
        const response = await httpClient.delete(`${API.GROUP}/dissolve/${groupId}`)
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi giải tán nhóm", error)
    }
}