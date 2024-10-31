import { API } from "../configs/config";
import httpClient from "../configs/httpClient";

export const createComment = async (form) => {
    return await httpClient.post(API.COMMENT, form);
};


export const getCommentById = async (id) => {
    try {
        const response = await httpClient.get(`${API.COMMENT}/${id}`);
        return response.data.result
    } catch (error) {
        console.error('Lỗi khi tải bình luận: ', error);
    }
};

export const getComments = async () => {
    const response = await httpClient.get(API.COMMENT);
    return response.data.result;
};

export const updateComment = async (post) => {
    // try {
    //     const response = await httpClient.put(`${API.COMMENT}/${comment.id}`, comment);
    //     return response.data;
    // } catch (error) {
    //     throw new Error('Cập nhật bình luận không thành công!');
    // }
};

export const getCommentsByPostId = async (postId) => {
    try {
        const response = await httpClient.get(`${API.POST}/${postId}/comments`);
        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi tải bình luận cho bài viết:', error);
    }
};













