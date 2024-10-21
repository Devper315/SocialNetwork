import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../../services/postService';
import '../../assets/styles/post/PostList.css';
import { Col, Container, Image, Row } from 'react-bootstrap';

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
        <Container fluid className="post-list-container">
        {posts.map((post) => {
          return (
            <Row key={post.id} className="post-item mb-4" onClick={() => handlePostClick(post.id)}>
              <Col>
                <p>{post.content}</p>
                <Row className="post-images">
                  {post.imageUrls &&
                    post.imageUrls.map((url, idx) => (
                      <Col xs={12} sm={6} md={4} lg={3} key={idx} className="mb-3">
                        <Image src={url} alt={`Ảnh ${idx}`} className="post-image img-fluid" />
                      </Col>
                    ))}
                </Row>
                <p>Thời gian: {post.time}</p>
              </Col>
            </Row>
          );
        })}
      </Container>
    );
};

export default PostList; 
