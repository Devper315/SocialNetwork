import { API } from "../configs/config";
import httpClient from "../configs/httpClient";

export const createPost = async (form) => {
    const response = await httpClient.post(API.POST, form);
    return response.data;
};


export const getPostById = async (id) => {
    try {
        const response = await httpClient.get(`${API.POST}/${id}`);
        return response.data.result
    } catch (error) { }
};

export const getPosts = async () => {
    const response = await httpClient.get(API.POST);
    return response.data.result;
};


export const updatePost = async (post) => {
    try {
        const response = await httpClient.put(`${API.POST}/${post.id}`, post);
        return response.data;
    } catch (error) {
        console.log('Cập nhật bài viết không thành công!', error.response);
    }
};
export const deletePost = async (postId) => {
    try {
        httpClient.delete(`${API.POST}/${postId}`);
    } catch (error) {
        console.log("Lỗi khi xóa bài viết", error.response)
    }
};
export const getPostsByGroup = async (groupId) => {
    try {
        const response = await httpClient.get(`${API.POST}/group/${groupId}`);
        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi lấy bài viết theo nhóm:', error);
    }
};

export const getPendingPostsByGroup = async (groupId, approval) => {
    try {
        const response = await httpClient.get(`${API.POST}/group/${groupId}/pending-approval/${approval}`);
        return response.data.result;
    } catch (error) { }
};

export const updateApprovalStatus = async (postId) => {
    try {
        const response = await httpClient.patch(`${API.POST}/${postId}/approval-status`);
        return response.data;
    } catch (error) { }
};

export const checkUser = async (postId) => {
    try {
        const response = await httpClient.get(`${API.POST}/check-user/${postId}`);
        return response.data;
    } catch (error) { }
}