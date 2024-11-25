import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

const PostList = ({ posts: propPosts = [], fetchPostsOnMount = true }) => {
  const [posts, setPosts] = useState(propPosts);
  const [loading, setLoading] = useState(fetchPostsOnMount && propPosts.length === 0);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    if (!fetchPostsOnMount || propPosts.length > 0) return;

    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response);
      } catch (err) {
        setError("Không thể lấy bài viết: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchPostsOnMount, propPosts]);

  const handlePostClick = (postId) => {
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

  if (posts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Không có bài viết nào để hiển thị.
        </Typography>
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
                  }}
                >
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
                  }}
                >
                  {post.content || "Không có nội dung"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.time
                    ? `Thời gian: ${new Date(post.time).toLocaleString()}`
                    : "Không rõ thời gian"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};


PostList.propTypes = {
  posts: PropTypes.array,
  fetchPostsOnMount: PropTypes.bool,
};

export default PostList;
