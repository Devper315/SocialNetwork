import React, { useEffect, useState } from 'react';
import { getPostById, updatePost } from '../../services/postService';
// import '../../assets/styles/post/PostPage.css';
import { useParams } from 'react-router-dom';

const PostPage = () => {
    const [post, setPost] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const {id} = useParams()

    useEffect(() => {
        const getPost = async () => {
            const postData = await getPostById(id)
            setEditedContent(postData.content)
            setImageFiles(postData.imageUrls || [])
            setStatus(postData.status)
            setPost(postData)
        }
        getPost()
    }, [id]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            const currentPost = {
                id: id,
                content: editedContent,
                imageUrls: imageFiles,
                status: status
            }
            await updatePost(currentPost);
            setPost((prevPost) => ({
                ...prevPost,
                content: editedContent,
                imageUrls: imageFiles,
                status: status
            }));
            setEditMode(false);
            setMessage("Chỉnh sửa bài viết thành công!");
        } catch (error) {
            console.error(error);
            setMessage("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImageFiles = files.map(file => URL.createObjectURL(file));
        setImageFiles((prevImages) => [...prevImages, ...newImageFiles]);
    };

    const handleRemoveImage = (index) => {
        setImageFiles((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (

        <div className="post-container">
            <div className="post-content">
                <div className="post-options">
                    <button className="post-options-button">...</button>
                    <div className="post-dropdown">
                        {editMode ? (
                            <button onClick={handleSave}>Lưu</button>
                        ) : (
                            <button onClick={handleEdit}>Sửa bài viết</button>
                        )}
                    </div>
                </div>
                {editMode ? (
                    <input
                        type="text"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="post-edit-input"
                    />
                ) : (
                    <p>{post.content}</p>
                )}

                <div className="post-images">
                    {imageFiles.map((url, index) => (
                        <div key={index} className="post-image-container">
                            <img src={url} alt={`ảnh ${index}`} className="post-image" />
                            {editMode && (
                                <button onClick={() => handleRemoveImage(index)} className="remove-image-button">Xóa</button>
                            )}
                        </div>
                    ))}
                </div>

                {editMode && (
                    <div>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                    </div>
                )}

                {message && <div className="success-message">{message}</div>}
            </div>
        </div>
    );
};

export default PostPage;
