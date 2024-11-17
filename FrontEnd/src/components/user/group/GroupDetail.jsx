import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupById, getGroupMembers } from "../../../services/groupService";
import { getPostsByGroup, deletePost, createPost } from "../../../services/postService";
import GroupEditModal from "./GroupEditModal";
import "../../../assets/styles/group/GroupDetail.css";
import PostPage from '../../../components/post/PostPage';

const GroupDetail = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");

    useEffect(() => {
        const getGroup = async () => {
            const data = await fetchGroupById(id);
            setGroup(data || {});
        };

        const getPosts = async () => {
            try {
                const postsData = await getPostsByGroup(id);
                setPosts(postsData || []);
            } catch (error) {
                console.error("Lỗi khi lấy bài viết theo nhóm:", error);
            }
        };

        getGroup();
        getPosts();
    }, [id]);

    const requestJoinGroup = () => {
        console.log("tham gia");
    };

    const leaveGroup = () => {
        console.log("roi nhom");
    };

    const openEditModal = () => {
        setShowModal(true);
    };

    const closeEditModal = () => {
        setShowModal(false);
    };

    const toggleMemberList = async () => {
        if (!showMembers) {
            const membersData = await getGroupMembers(id);
            setMembers(membersData || []);
        }
        setShowMembers(!showMembers);
    };

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
            alert("Bài viết đã được xóa!");
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi xóa bài viết.");
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent) {
            alert("Vui lòng nhập nội dung bài viết!");
            return;
        }

        try {
            const postForm = {
                content: newPostContent,
                groupId: id,
            };
            const newPost = await createPost(postForm);
            setPosts([newPost, ...posts]);
            setNewPostContent("");
            alert("Bài viết đã được thêm!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="group-detail-container">
            <div className="group-actions">
                <button onClick={openEditModal}>Sửa thông tin nhóm</button>
                <button onClick={toggleMemberList}>Danh sách thành viên</button>
                {!group.joined && <button onClick={requestJoinGroup}>Yêu cầu tham gia nhóm</button>}
                {group.joined && <button onClick={leaveGroup}>Rời nhóm</button>}
            </div>

            {showMembers ? (
                <div className="members-list">
                    <h6>Danh sách thành viên:</h6>
                    <ul>
                        {members.map((member) => (
                            <li key={member.id}>{member.fullName}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    <div className="new-post-form">
                        <h6>Thêm bài viết mới</h6>
                        <form onSubmit={handleCreatePost}>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Nhập nội dung bài viết..."
                                rows="4"
                                style={{ width: "100%" }}
                            />
                            <button type="submit">Đăng bài</button>
                        </form>
                    </div>

                    <div className="posts-list">
                        <ul>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <li key={post.id} className="post-item">
                                        <PostPage postId={post.id} />
                                    </li>
                                ))
                            ) : (
                                <div>Không có bài viết nào.</div>
                            )}
                        </ul>
                    </div>
                </>
            )}

            <GroupEditModal
                show={showModal}
                handleClose={closeEditModal}
                originalGroup={group}
                setOriginalGroup={setGroup}
            />
        </div>
    );
};

export default GroupDetail;