import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const createGroup = async (form) => {
    try {
        const response = await httpClient.post(API.GROUP, form)
        console.log(response.data.result)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const fetchGroups = async (page, keyword) => {
    const params = { keyword, page: page - 1 }
    try {
        const response = await httpClient.get(API.GROUP, { params })
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const fetchMyGroups = async (page, keyword) => {
    const params = { keyword, page: page - 1 }
    try {
        const response = await httpClient.get(`${API.GROUP}/my`, { params })
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const fetchGroupById = async (id) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/detail/${id}`)
        return response.data.result
    } catch (error) {
        console.log(error)
    }
}

export const updateGroup = async (form) => {
    try {
        const response = await httpClient.put(API.GROUP, form)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const addGroupMember = async (groupId, userId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/add-member`, null, {
            params: { groupId, userId }
        });
        return response.data.result;
    } catch (error) {
        console.log(error);
    }
};

export const removeGroupMember = async (groupId, userId) => {
    try {
        const response = await httpClient.delete(`${API.GROUP}/remove-member`, {
            params: { groupId, userId }
        });
        return response.data.result;
    } catch (error) {
        console.log(error);
    }
};
export const leaveGroup = async (groupId) => {
    try {
        const response = await httpClient.delete(`${API.GROUP}/leave-group`, {
            params: { groupId }
        });
        return response.data.result;
    } catch (error) {
        console.log(error);
    }
};

export const getGroupMembers = async (groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/members/${groupId}`);
        return response.data.result;
    } catch (error) {
        console.log(error);
    }
};

export const sendJoinGroupRequest = async (groupId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/requests/${groupId}`);
        console.log("Đã gửi yêu cầu tham gia nhóm", response.data.result);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const fetchGroupJoinRequests = async (groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/requests/${groupId}/admin-requests`);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};



export const actionJoinGroupRequest = async (requestId, accept) => {
    const response = await httpClient.post(`${API.GROUP}/requests/${requestId}/action/${accept}`);
    console.log(response.data);
    return response;

};


export const checkIfRequestExists = async (groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/requests/exists/${groupId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const checkUser = async (groupId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/check-user/${groupId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getUserRoleInGroup = async (groupId, userId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/role/${groupId}/user/${userId}`);
        return response.data.result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const changeRole = async (groupId, userId, roleId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/change-role/${groupId}/${userId}/${roleId}`);
        return response.data.result;
    } catch (error) {
        console.error("Lỗi khi thay đổi vai trò:", error);
        throw new Error("Không thể thay đổi vai trò của thành viên!");
    }
};
export const getRole = async (groupId, userId) => {
    try {
        const response = await httpClient.get(`${API.GROUP}/get-role/${groupId}/${userId}`);
        return response.data.result;
    } catch (error) {
        console.error("Lỗi khi lấy vai trò của thành viên:", error);
        throw new Error("Không thể lấy vai trò của thành viên!");
    }
};
export const changeCreateUserId = async (groupId, userId) => {
    try {
        const response = await httpClient.post(`${API.GROUP}/change-createUserId/${groupId}/${userId}`);
        return response.data.result;
    } catch (error) {
        console.error("Lỗi khi thay đổi vai trò:", error);
        throw new Error("Không thể thay đổi vai trò của thành viên!");
    }
};
export const dissolve = async (groupId) => {
    try {
        const response = await httpClient.delete(`${API.GROUP}/dissolve/${groupId}`);
        return response.data.result;
    } catch (error) {
    }
};