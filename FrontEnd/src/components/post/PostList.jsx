import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/postService";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        console.log("Fetched Posts:", response);
        setPosts(response);
      } catch (error) {
        setError("Không thể lấy bài viết: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    console.log("Navigating to PostPage with ID:", postId);
    navigate(`/postpage/${postId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "16px" }}>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" },
              }}
              onClick={() => handlePostClick(post.id)}
            >
              {post.imageUrls && post.imageUrls[0] && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.imageUrls[0]}
                  alt={`Ảnh bài viết ${post.id}`}
                />
              )}
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: "8px",
                  }}
                >
                  {post.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Thời gian: {new Date(post.time).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;
