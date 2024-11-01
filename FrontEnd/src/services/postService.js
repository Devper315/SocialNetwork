import { API } from "../configs/config";
import httpClient from "../configs/httpClient";

export const createPost = async (form) => {
    return await httpClient.post(API.POST, form);
};


export const getPostById = async (id) => {
    try {
        const response = await httpClient.get(`${API.POST}/${id}`);
        return response.data.result
    } catch (error) {
        console.error('Lỗi khi tải bài viết: ', error);
    }
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
        throw new Error('Cập nhật bài viết không thành công!');
    }
};


export const deletePost = async (postId) => {
    try {
        const response = await httpClient.delete(`${API.POST}/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa bài viết: ', error.response?.data || error.message);
        throw error;
    }
};










