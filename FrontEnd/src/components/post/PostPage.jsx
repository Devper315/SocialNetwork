import React, { useEffect, useState } from 'react';
import { getPostById, updatePost, checkUser } from '../../services/postService';
import { getCommentsByPostId, createComment } from '../../services/commentService';
import { useParams } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
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
        const fetchData = async () => {
            try {

                const { content, imageUrls = [], userName } = await getPostById(id);
                setPost({ content, imageUrls, userName });
                setEditedContent(content);
                setImageFiles(imageUrls);


                const result = await checkUser(id);
                setUserPermission(result);


                const commentsData = await getCommentsByPostId(id);
                setComments(commentsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
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
            setPost(prevPost => ({
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
        return <Typography>Khôg có bài viết nào</Typography>;
    }

    return (
        <Box className="post-container" sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                {post.userName}
            </Typography>
            <Box className="post-content" sx={{ marginBottom: 2 }}>
                <Box className="post-options" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {userPermission === 1 && (
                        <Button onClick={editMode ? handleSave : handleEditToggle} variant="contained">
                            {editMode ? "Lưu" : "Sửa bài viết"}
                        </Button>
                    )}
                </Box>
                {editMode ? (
                    <TextField
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        variant="outlined"
                        multiline
                        fullWidth
                        rows={5}
                    />
                ) : (
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'normal',
                                overflow: showFullContent ? 'auto' : 'hidden',
                                maxHeight: showFullContent ? 'none' : '60px',
                            }}>
                            {post.content}
                        </Typography>
                        {!showFullContent && post.content.length > 250 && (
                            <Button onClick={() => setShowFullContent(true)} sx={{ marginTop: 1 }}>
                                Xem thêm
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            <Box className="post-images" sx={{ padding: 2 }}>
                {imageFiles.map((url, index) => (
                    <Box key={index} sx={{ position: 'relative', display: 'inline-block', marginRight: 2 }}>
                        <img src={url} alt={`ảnh ${index}`} className="post-image" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                        {editMode && (
                            <Button
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    fontSize: '12px',
                                    borderRadius: '50%',
                                }}>
                                Xóa
                            </Button>
                        )}
                    </Box>
                ))}
                {editMode && <input type="file" multiple accept="image/*" onChange={handleImageChange} />}
            </Box>

            {message && <Typography variant="body2" sx={{ color: 'green', marginBottom: 2 }}>{message}</Typography>}

            {comments.length > 0 && <CommentList postId={id} />}

            <Box className="new-comment-container" sx={{ marginTop: 2 }}>
                <TextField
                    value={newComment}
                    onChange={handleNewCommentChange}
                    variant="outlined"
                    placeholder="Nhập bình luận của bạn..."
                    multiline
                    fullWidth
                    rows={3}
                />
                <input type="file" accept="image/*" onChange={handleNewCommentImageChange} />
                <Button onClick={handleCreateComment} variant="contained" sx={{ marginTop: 2 }}>
                    Thêm bình luận
                </Button>
                {newCommentImage && (
                    <img src={newCommentImage} alt="Hình bình luận" className="comment-preview" style={{ maxWidth: '100px', marginTop: '10px' }} />
                )}
            </Box>
        </Box>
    );
};

export default PostPage;
