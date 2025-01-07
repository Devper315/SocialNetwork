import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const createPost = async(data) => {
    const response = await httpClient.post(API.POST, data);
    return response.data.result
}
export const getPostById = async(id) => {
    try {
        const response = await httpClient.get(`${API.POST}/${id}`);
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy bài viết theo id", error)
    }
}
export const updatePost = async(post) => {
    try {
        const response = await httpClient.put(API.POST, post)
        return response.data.result
    } catch (error) {
        console.log('Cập nhật bài viết không thành công!', error);
    }
}
export const deletePost = async(postId) => {
    try {
        httpClient.delete(`${API.POST}/${postId}`);
    } catch (error) {
        console.log("Lỗi khi xóa bài viết", error.response)
    }
}
export const getPostsByGroupId = async(groupId, status) => {
    try {
        const params = { groupId, status }
        const response = await httpClient.get(`${API.POST}/group`, { params });
        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết theo nhóm:', error);
    }
};

export const getPostsByUserId = async(userId) => {
    try {
        const response = await httpClient.get(`${API.USER_POST}/${userId}`);
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi lấy bài viết theo id người dùng", error)
    }
}

export const getPosts = async() => {
    const response = await httpClient.get(API.POST);
    return response.data.result;
};

export const approvePost = async(postId, approvalStatus) => {
    try {
        const params = { postId, approvalStatus }
        console.log(params)
        await httpClient.patch(`${API.POST}/approve`, null, { params });
    } catch (error) {
        console.log("Lỗi khi phê duyệt bài viết", error)
    }
};