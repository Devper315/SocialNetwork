import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchGroupById,
    getGroupMembers,
    sendJoinGroupRequest,
    checkIfRequestExists,
    actionJoinGroupRequest,
    fetchGroupJoinRequests,
    checkGroupCreator,
} from "../../../services/groupService";
import { getPostsByGroup, createPost } from "../../../services/postService";
import GroupEditModal from "./GroupEditModal";
import GroupJoinRequests from "./GroupJoinRequests";
import "../../../assets/styles/group/GroupDetail.css";
import PostPage from "../../../components/post/PostPage";

const GroupDetail = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const [isGroupCreator, setIsGroupCreator] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupData = await fetchGroupById(id);
                const membersData = await getGroupMembers(id);
                const creatorStatus = await checkGroupCreator(id);
                const postsData = await getPostsByGroup(id);
                const requestPending = await checkIfRequestExists(id);

                setGroup(groupData || {});
                setMembers(membersData || []);
                setPosts(postsData || []);
                setIsGroupCreator(creatorStatus);
                setIsRequestPending(requestPending);
            } catch (error) {
                console.error("Error fetching group data:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).map((file) =>
            URL.createObjectURL(file)
        );
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await createPost({ groupId: id, content: newPostContent, imageUrls: imageFiles });
            alert("Bài viết đã được thêm!");
            setNewPostContent("");
            setImageFiles([]);
            const updatedPosts = await getPostsByGroup(id);
            setPosts(updatedPosts || []);
        } catch {
            alert("Có lỗi xảy ra khi thêm bài viết.");
        }
    };

    const handleJoinRequest = async () => {
        try {
            await sendJoinGroupRequest(id);
            alert("Yêu cầu tham gia nhóm đã được gửi.");
            setIsRequestPending(true);
        } catch {
            alert("Có lỗi xảy ra khi gửi yêu cầu.");
        }
    };

    return (
        <div className="group-detail-container">
            <div className="group-actions">
                <button onClick={() => setShowModal(true)}>Sửa thông tin nhóm</button>
                <button onClick={() => setShowMembers(!showMembers)}>Danh sách thành viên</button>
                {isRequestPending ? (
                    <button disabled>Đang chờ phê duyệt</button>
                ) : group.joined ? (
                    <>
                        <button>Rời nhóm</button>
                        {isGroupCreator && (
                            <button onClick={() => setShowJoinRequests(true)}>Danh sách lời mời</button>
                        )}
                    </>
                ) : (
                    <button onClick={handleJoinRequest}>Yêu cầu tham gia nhóm</button>
                )}
            </div>

            {showMembers && (
                <div className="members-list">
                    <h6>Danh sách thành viên:</h6>
                    <ul>
                        {members.map((member) => (
                            <li key={member.id}>{member.fullName}</li>
                        ))}
                    </ul>
                </div>
            )}

            {showJoinRequests && (
                <GroupJoinRequests groupId={id} closeRequests={() => setShowJoinRequests(false)} />
            )}

            {!showMembers && !showJoinRequests && (
                <>
                    <div className="new-post-form">
                        <h6>Thêm bài viết mới</h6>
                        <form onSubmit={handleCreatePost}>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Nhập nội dung bài viết..."
                                rows="4"
                            />
                            <div className="post-images">
                                {imageFiles.map((url, index) => (
                                    <div key={index} className="post-image-container">
                                        <img src={url} alt={`ảnh ${index}`} />
                                        <button type="button" onClick={() => handleRemoveImage(index)}>Xóa</button>
                                    </div>
                                ))}
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                            </div>
                            <button type="submit">Đăng bài</button>
                        </form>
                    </div>

                    <div className="posts-list">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <li key={post.id}>
                                    <PostPage postId={post.id} />
                                </li>
                            ))
                        ) : (
                            <div>Không có bài viết nào.</div>
                        )}
                    </div>
                </>
            )}

            <GroupEditModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                originalGroup={group}
                setOriginalGroup={setGroup}
            />
        </div>
    );
};

export default GroupDetail;
