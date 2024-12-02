import { API } from "../configs/config";
import httpClient from "../configs/httpClient";

export const createComment = async(form) => {
    try {
        const response = await httpClient.post(API.COMMENT, form);
        return response.data.result
    } catch (error) {
        console.log("Lỗi khi tạo bình luận", error.response)
    }
}

export const getCommentById = async(id) => {
    try {
        const response = await httpClient.get(`${API.COMMENT}/${id}`);
        return response.data.result
    } catch (error) {
        console.error('Lỗi khi tải bình luận: ', error);
    }
};
export const updateComment = async(comment) => {
    try {
        const response = await httpClient.put(`${API.COMMENT}/${comment.id}`, {});
        return response.data.result;
    } catch (error) {
        console.log("Lỗi khi sửa comment", error.response)
    }
}

export const getComments = async() => {
    const response = await httpClient.get(API.COMMENT);
    return response.data.result;
};

export const fetchCommentsByPostId = async(postId) => {
    try {
        const response = await httpClient.get(`${API.COMMENT}/${postId}/comments`)
        return response.data.result
    } catch (error) {
        console.error('Lỗi khi tải bình luận cho bài viết:', error)
    }
};
export const deleteCommentById = async(commentId) => {
    try {
        const response = await httpClient.delete(`${API.COMMENT}/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa bình luận: ', error.response.data);
    }
}