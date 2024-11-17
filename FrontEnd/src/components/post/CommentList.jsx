import React, { useEffect, useState } from 'react';
import { getCommentsByPostId, updateComment, deleteComment } from '../../services/commentService';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import '../../assets/styles/post/CommentList.css';
import { uploadImage } from '../../services/imageService';


const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [editedImageFile, setEditedImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await getCommentsByPostId(postId);
                setComments(response || []);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handleEditToggle = (commentId, content, imageUrl) => {
        setEditCommentId(commentId);
        setEditedContent(content);
        setEditedImageFile(null);
        setCurrentImageUrl(imageUrl);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditedImageFile(file);
            setCurrentImageUrl(URL.createObjectURL(file));
        }
    };


    const handleSave = async () => {
        if (editCommentId === null) return;

        let imageUrl = currentImageUrl;

        if (editedImageFile) {
            try {
                imageUrl = await uploadImage(editedImageFile);
                console.log(imageUrl)
            } catch (error) {
                console.error('Failed to upload image:', error);
                return;
            }
        }

        const commentToUpdate = {
            id: editCommentId,
            content: editedContent || '',
            imageUrl: imageUrl || null
        };

        try {
            const updatedComment = await updateComment(commentToUpdate);
            setComments(prev => prev.map(comment => comment.id === editCommentId ? updatedComment : comment));
            setEditCommentId(null);
            setEditedContent('');
            setEditedImageFile(null);
            setCurrentImageUrl('');
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };


    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(comment => comment.id !== commentId));

        } catch (error) {
        }
    };


    return (
        <Container fluid className="comment-list-container">
            {comments.map(({ id, userName, content, imageUrl, time }) => (
                <Row key={id} className="comment-item mb-4">
                    <Col>
                        <p className="comment-user-name"><strong>{userName}</strong></p>
                        {editCommentId === id ? (
                            <div>
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="comment-edit-input"
                                    rows={3}
                                />
                                {currentImageUrl && (
                                    <div>
                                        <img src={currentImageUrl} alt="Current comment" className="comment-image-preview" />
                                        <button onClick={() => setCurrentImageUrl('')}>Xóa ảnh</button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                <button onClick={handleSave} className="save-comment-button">Lưu</button>
                                <button onClick={() => setEditCommentId(null)} className="cancel-edit-button">Hủy</button>
                            </div>
                        ) : (
                            <div>
                                <p className="comment-content">{content}</p>
                                {imageUrl && <img src={imageUrl} alt={`Comment image ${id}`} className="comment-image" />}
                            </div>
                        )}
                        <p className="comment-time">Thời gian: {new Date(time).toLocaleString()}</p>
                        <Dropdown className="float-end">
                            <Dropdown.Toggle variant="link" id={`dropdown-basic-${id}`}>
                                <span className="three-dots">⋮</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditToggle(id, content, imageUrl)}>Sửa</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(id)}>Xóa</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            ))}
        </Container>
    );
};

export default CommentList;
