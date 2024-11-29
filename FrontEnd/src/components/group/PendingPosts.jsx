import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPendingPostsByGroup, updateApprovalStatus, deletePost } from '../../services/postService';
import PostPage from "../../components/post/PostPage";
import { Box, Button, Typography, List, ListItem, CircularProgress } from '@mui/material';

const PendingPostsPage = () => {
    const { groupId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await getPendingPostsByGroup(groupId, 0);
                setPosts(result);
            } catch (error) {
                console.error("Lỗi khi lấy bài viết cần phê duyệt:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [groupId]);

    const handleApprove = async (postId) => {
        try {
            const result = await updateApprovalStatus(postId);
            alert("Bài viết đã được phê duyệt.");
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error("Lỗi khi phê duyệt bài viết:", error);
            alert("Có lỗi xảy ra khi phê duyệt bài viết.");
        }
    };

    const handleReject = async (postId) => {
        try {
            await deletePost(postId);
            alert("Bài viết đã bị từ chối.");
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error("Lỗi khi từ chối bài viết:", error);
            alert("Có lỗi xảy ra khi từ chối bài viết.");
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 3 }}>
            <Typography variant="h4" gutterBottom>
                Danh sách bài viết chờ phê duyệt
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <ListItem key={post.id} sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                <PostPage postId={post.id} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Button
                                        onClick={() => handleApprove(post.id)}
                                        variant="contained"
                                        color="success"
                                        sx={{ mr: 1 }}
                                    >
                                        Phê duyệt
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(post.id)}
                                        variant="contained"
                                        color="error"
                                    >
                                        Từ chối
                                    </Button>
                                </Box>
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            Không có bài viết nào.
                        </Typography>
                    )}
                </List>
            )}
        </Box>
    );
};

export default PendingPostsPage;
