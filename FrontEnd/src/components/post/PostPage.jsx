import React, { useEffect, useState } from 'react';
import { getPostById, updatePost, checkUser } from '../../services/postService';
import { getCommentsByPostId, createComment } from '../../services/commentService';
import { useParams } from 'react-router-dom';
import '../../assets/styles/post/PostPage.css';
import CommentList from '../../components/post/CommentList';

const PostPage = ({ postId }) => {
    const { id: urlId } = useParams();
    const id = postId || urlId;
    const [post, setPost] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [showFullContent, setShowFullContent] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newCommentImage, setNewCommentImage] = useState(null);
    const [userPermission, setUserPermission] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const { content, imageUrls = [], userName } = await getPostById(id);
            setPost({ content, imageUrls, userName });
            setEditedContent(content);
            setImageFiles(imageUrls);

        };

        const fetchCheckUser = async () => {
            try {
                const result = await checkUser(id);
                setUserPermission(result);
            } catch (error) {
                console.error(error);
            }
        };


        const fetchComments = async () => {
            try {
                const commentsData = await getCommentsByPostId(id);
                setComments(commentsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
        fetchComments();
        fetchCheckUser();
    }, [id]);

    const handleEditToggle = () => {
        setEditMode(prev => !prev);
        setShowFullContent(false);
    };

    const handleSave = async () => {
        try {
            const currentPost = {
                id: id,
                content: editedContent,
                imageUrls: imageFiles,
            };
            await updatePost(currentPost);
            setPost((prevPost) => ({
                ...prevPost,
                content: editedContent,
                imageUrls: imageFiles,
            }));
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

    const handleNewCommentChange = e => setNewComment(e.target.value);

    const handleNewCommentImageChange = e => {
        setNewCommentImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleCreateComment = async () => {
        try {
            const form = { content: newComment, imageUrl: newCommentImage, postId: id };
            console.log(form);
            await createComment(form);
            setComments(prev => [...prev, { content: newComment, imageUrl: newCommentImage }]);
            setNewComment('');
            setNewCommentImage(null);
            setMessage("Bình luận đã được thêm!");
        } catch {
            setMessage("Có lỗi xảy ra khi thêm bình luận!");
        }
    };

    if (!post) {
        return <p>Đang tải bài viết...</p>;
    }

    return (
        <div className="post-container" >
            <div className="post-author">
                {post.userName}
            </div>
            <div className="post-content">
                <div className="post-options">
                    {userPermission === 1 && (
                        <button onClick={editMode ? handleSave : handleEditToggle}>
                            {editMode ? "Lưu" : "Sửa bài viết"}
                        </button>
                    )}


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

            <div className="post-images" style={{ padding: '10px', overflowY: 'auto' }}>
                {imageFiles.map((url, index) => (
                    <div key={index} className="post-image-container">
                        <img src={url} alt={`ảnh ${index}`} className="post-image" />
                        {editMode && <button onClick={() => handleRemoveImage(index)} className="remove-image-button">Xóa</button>}
                    </div>
                ))}
                {editMode && <input type="file" multiple accept="image/*" onChange={handleImageChange} />}
            </div>

            {message && <div className="success-message">{message}</div>}

            {comments.length > 0 && (
                <CommentList postId={id} />
            )}

            <div className="new-comment-container">
                <textarea
                    value={newComment}
                    onChange={handleNewCommentChange}
                    className="new-comment-input"
                    placeholder="Nhập bình luận của bạn..."
                    rows={3}
                />
                <input type="file" accept="image/*" onChange={handleNewCommentImageChange} />
                <button onClick={handleCreateComment} className="create-comment-button">Thêm bình luận</button>
                {newCommentImage && <img src={newCommentImage} alt="Hình bình luận" className="comment-preview" />}
            </div>
        </div>
    );
};

export default PostPage;
