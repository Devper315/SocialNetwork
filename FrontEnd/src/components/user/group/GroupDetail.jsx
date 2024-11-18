import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupById, getGroupMembers } from "../../../services/groupService";
import { getPostsByGroup, createPost } from "../../../services/postService";
import GroupEditModal from "./GroupEditModal";
import "../../../assets/styles/group/GroupDetail.css";
import PostPage from "../../../components/post/PostPage";

const GroupDetail = () => {
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [imageFiles, setImageFiles] = useState([]);

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
                console.error("Error fetching group posts:", error);
            }
        };

        getGroup();
        getPosts();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImageUrls = files.map((file) => URL.createObjectURL(file));
        setImageFiles((prevFiles) => [...prevFiles, ...newImageUrls]);
    };

    const handleRemoveImage = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const newPost = {
                groupId: id,
                content: newPostContent,
                imageUrls: imageFiles,
            };
            await createPost(newPost);
            alert("Bài viết đã được thêm!");
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra");
        }
    };

    return (
        <div className="group-detail-container">
            <div className="group-actions">
                <button onClick={() => setShowModal(true)}>Sửa thông tin nhóm</button>
                <button onClick={() => setShowMembers(!showMembers)}>Danh sách thành viên</button>
                {!group.joined ? (
                    <button>Yêu cầu tham gia nhóm</button>
                ) : (
                    <button>Rời nhóm</button>
                )}
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
                            />
                            <div className="post-images">
                                {imageFiles.map((url, index) => (
                                    <div key={index} className="post-image-container">
                                        <img src={url} alt={`ảnh ${index}`} />
                                        <button onClick={() => handleRemoveImage(index)}>Xóa</button>
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
