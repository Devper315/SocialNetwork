import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/postService";
import { Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts();
            setPosts(response);
            setLoading(false);
        }
        fetchPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/postpage/${postId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (posts.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <Typography variant="body1" color="text.secondary">
                    Không có bài viết nào để hiển thị.
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ padding: "16px" }}>
            {posts.map((post) => (
                <Card
                    key={post.id}
                    sx={{
                        marginBottom: "16px",
                        cursor: "pointer",
                        "&:hover": { boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" },
                    }}
                    onClick={() => handlePostClick(post.id)}>
                    {post.imageUrls && post.imageUrls[0] ? (
                        <CardMedia
                            component="img"
                            height="200"
                            image={post.imageUrls[0]}
                            alt={`Ảnh bài viết ${post.id}`}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: "200px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#f0f0f0",
                            }}>
                            <Typography variant="body2" color="text.secondary">
                                Không có ảnh
                            </Typography>
                        </Box>
                    )}
                    <CardContent>
                        <Typography
                            variant="body1"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginBottom: "8px",
                            }}>
                            {post.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(post.time).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}

export default PostList;
