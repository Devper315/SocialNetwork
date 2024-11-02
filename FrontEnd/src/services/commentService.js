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
export const updateComment = async (comment) => {
    try {
        const response = await httpClient.put(`${API.COMMENT}/${comment.id}`, {
            content: comment.content,
            imageUrl: comment.imageUrl
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getComments = async () => {
    const response = await httpClient.get(API.COMMENT);
    return response.data.result;
};

export const getCommentsByPostId = async (postId) => {
    try {
        const response = await httpClient.get(`${API.COMMENT}/${postId}/comments`);
        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi tải bình luận cho bài viết:', error);
    }
};
export const deleteComment = async (commentId) => {
    try {
        const response = await httpClient.delete(`${API.COMMENT}/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa bài viết: ', error.response?.data || error.message);
        throw error;
    }
};













