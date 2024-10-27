import React, { useEffect, useState } from 'react';
import { getPostById, updatePost } from '../../services/postService';
import { createComment, getCommentsByPostId } from '../../services/commentService';
import { useParams } from 'react-router-dom';
import '../../assets/styles/post/PostPage.css';

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [showFullContent, setShowFullContent] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            const { content, imageUrls = [] } = await getPostById(id);
            setPost({ content, imageUrls });
            setEditedContent(content);
            setImageFiles(imageUrls);
        };

        const fetchComments = async () => {
            const comments = await getCommentsByPostId(id);
            setComments(comments);
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleEdit = () => {
        setEditMode(true);
        setShowFullContent(false);
    };

    const handleSave = async () => {
        try {
            await updatePost({ id, content: editedContent, imageUrls: imageFiles });
            setPost(prev => ({ ...prev, content: editedContent, imageUrls: imageFiles }));
            setEditMode(false);
            setMessage("Chỉnh sửa bài viết thành công!");
        } catch (error) {
            console.error(error);
            setMessage("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const handleImageChange = ({ target: { files } }) => {
        setImageFiles(prev => [...prev, ...Array.from(files).map(file => URL.createObjectURL(file))]);
    };

    const handleRemoveImage = index => setImageFiles(prev => prev.filter((_, i) => i !== index));

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const commentData = {
                    content: newComment,
                    imageUrl: uploadedImageUrl
                };

                const comment = await createComment(commentData);
                setComments(prev => [...prev, comment]);
                setNewComment('');
            } catch (error) {
                console.error(error);
                setMessage("Không thể thêm bình luận, vui lòng thử lại!");
            }
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="post-container" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="post-content" style={{ flex: '0 0 40%', padding: '5px', overflowY: 'auto' }}>
                <div className="post-options">
                    <button onClick={editMode ? handleSave : handleEdit}>
                        {editMode ? "Lưu" : "Sửa bài viết"}
                    </button>
                </div>
                {editMode ? (
                    <textarea
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        className="post-edit-input"
                        rows={5}
                    />
                ) : (
                    <div>
                        <div
                            className={`post-text`}
                            style={{
                                whiteSpace: 'normal',
                                overflow: showFullContent ? 'auto' : 'hidden',
                                maxHeight: showFullContent ? 'none' : '60px'
                            }}>
                            {post.content}
                        </div>
                        {!showFullContent && post.content.length > 250 && (
                            <button onClick={() => setShowFullContent(true)} className="view-full-content-button">
                                Xem thêm
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="post-images" style={{ flex: '0 0 60%', padding: '10px', overflowY: 'auto' }}>
                {imageFiles.map((url, index) => (
                    <div key={index} className="post-image-container">
                        <img src={url} alt={`ảnh ${index}`} className="post-image" />
                        {editMode && <button onClick={() => handleRemoveImage(index)} className="remove-image-button">Xóa</button>}
                    </div>
                ))}
                {editMode && <input type="file" multiple accept="image/*" onChange={handleImageChange} />}
            </div>

            <div className="comments-section">
                <h3>Bình luận</h3>
                <div className="comments-list">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p><strong>{comment.user}</strong>: {comment.text}</p>
                        </div>
                    ))}
                </div>
                <div className="add-comment">
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Đăng</button>
                </div>
            </div>

            {message && <div className="success-message">{message}</div>}
        </div>
    );
};

export default PostPage;
