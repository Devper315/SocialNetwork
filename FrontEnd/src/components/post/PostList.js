import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../../services/postService';
import '../../assets/styles/post/PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPosts();
                console.log('Fetched Posts:', response);
                setPosts(response);
            } catch (error) {
                setError('Không thể lấy bài viết: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (posts.length === 0) {
        return <div>Không có bài viết nào.</div>;
    }

    const handlePostClick = (postId) => {
        console.log('Navigating to PostPage with ID:', postId);
        navigate(`/postpage/${postId}`);
    };


    return (
        <div className="post-list-container">
            {posts.map((post) => {
                console.log('Post ID:', post.id);
                return (
                    <div key={post.id} className="post-item" onClick={() => handlePostClick(post.id)}>
                        <p>{post.content}</p>
                        <div className="post-images">
                            {post.imageUrls && post.imageUrls.map((url, idx) => (
                                <img key={idx} src={url} alt={`Image ${idx}`} className="post-image" />
                            ))}
                        </div>
                        <p>Thời gian: {post.time}</p>
                    </div>
                );
            })}

        </div>
    );
};

export default PostList; 
