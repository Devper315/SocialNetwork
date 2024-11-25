import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPendingPostsByGroup, updateApprovalStatus, deletePost } from '../../services/postService';
import PostPage from "../../components/post/PostPage";

const PendingPostsPage = () => {
    const { groupId } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await getPendingPostsByGroup(groupId, 0);
                setPosts(result);
            } catch (error) {
                console.error("Lỗi khi lấy bài viết cần phê duyệt:", error);
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
        <div>
            <h1>Danh sách bài viết chờ phê duyệt</h1>
            <ul>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id} style={{ marginBottom: "1rem" }}>
                            <PostPage postId={post.id} />
                            <div style={{ marginTop: "0.5rem" }}>
                                <button
                                    onClick={() => handleApprove(post.id)}
                                    style={{
                                        marginRight: "0.5rem",
                                        backgroundColor: "green",
                                        color: "white",
                                        border: "none",
                                        padding: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Phê duyệt
                                </button>
                                <button
                                    onClick={() => handleReject(post.id)}
                                    style={{
                                        backgroundColor: "red",
                                        color: "white",
                                        border: "none",
                                        padding: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Từ chối
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <div>Không có bài viết nào.</div>
                )}
            </ul>
        </div>
    );
};

export default PendingPostsPage;
