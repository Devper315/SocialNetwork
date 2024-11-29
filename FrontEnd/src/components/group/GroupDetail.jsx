import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchGroupById,
    getGroupMembers,
    sendJoinGroupRequest,
    checkIfRequestExists,
    removeGroupMember,
    changeRole,
    checkUser,
    leaveGroup
} from "../../services/groupService";
import {
    getPostsByGroup,
    createPost,
    getPendingPostsByGroup,
} from "../../services/postService";
import GroupEditModal from "./GroupEditModal";
import GroupJoinRequests from "./GroupJoinRequests";
import PostPage from "../../components/post/PostPage";
import "../../assets/styles/group/GroupDetail.css";
import { uploadImage } from "../../services/imageService";

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState({});
    const [showLeaveGroupPopup, setShowLeaveGroupPopup] = useState(false);

    const [state, setState] = useState({
        showModal: false,
        showMembers: false,
        showJoinRequests: false,
        isRequestPending: false,
        userStatus: null,
        members: [],
        posts: [],
        newPostContent: "",
        imageFiles: [],

    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupData, membersData, postsData, requestPending, userStatus] = await Promise.all([
                    fetchGroupById(id),
                    getGroupMembers(id),
                    getPendingPostsByGroup(id, 1),
                    checkIfRequestExists(id),
                    checkUser(id),
                ]);
                setGroup(groupData || {});
                setState((prev) => ({
                    ...prev,
                    members: membersData || [],
                    posts: postsData || [],
                    isRequestPending: requestPending,
                    userStatus,
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id]);

    const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const approvalStatus = state.userStatus === 1 || state.userStatus === 2 ? 1 : 0;
            await createPost({ groupId: id, content: state.newPostContent, imageUrls: state.imageFiles, approvalStatus });
            const successMessage = approvalStatus === 1
                ? "Bài viết đã được thêm thành công"
                : "Bài viết đã được gửi cho quản trị viên phê duyệt.";
            alert(successMessage);
            const postsData = await getPendingPostsByGroup(id, 1);
            setState((prev) => ({
                ...prev,
                posts: postsData || [],
                newPostContent: "",
                imageFiles: [],
            }));
        } catch (error) {
            alert("Có lỗi xảy ra khi thêm bài viết.");
        }
    };

    const handleLeaveGroup = async () => {
        if (state.userStatus === 1) {
            alert("Nhường tư cách Quản trị viên trước khi rời nhóm");
            return;
        }
        try {
            const result = await leaveGroup(id);
            if (result) {
                alert("Bạn đã rời nhóm thành công.");
                setGroup((prev) => ({ ...prev, joined: false }));
                setState((prev) => ({ ...prev, userStatus: null }));
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error leaving group:", error);
            alert("Có lỗi xảy ra.");
        } finally {
            setShowLeaveGroupPopup(false);
        }
    };






    const handleAction = async (action, args, successMessage) => {
        try {
            await action(...args);
            alert(successMessage);
            if (action === sendJoinGroupRequest) {
                updateState({ isRequestPending: true });
            }
        } catch (error) {
            alert("Có lỗi xảy ra.");
        }
    };




    const renderConfirmPopup = () => (
        <div className="popup">
            <div className="popup-content">
                <p>Bạn có chắc chắn muốn rời nhóm?</p>
                <button onClick={handleLeaveGroup}>Đồng ý</button>
                <button onClick={() => updateState({ showConfirmLeavePopup: false })}>Hủy</button>
            </div>
        </div>
    );


    const renderMemberActions = (member) => {
        const isCreator = member.role === 1;
        const isModerator = member.role === 2;
        return (
            !isCreator && (
                <>
                    {isModerator ? (
                        <>
                            <button onClick={() => handleAction(changeRole, [group.id, member.id, 3], "Vai trò đã thay đổi")}>
                                Hủy tư cách kiểm duyệt
                            </button>
                        </>
                    ) : (
                        <button onClick={() => handleAction(changeRole, [group.id, member.id, 2], "Đã chọn làm kiểm duyệt")}>
                            Chọn làm người kiểm duyệt
                        </button>
                    )}
                    <button onClick={() => handleAction(removeGroupMember, [group.id, member.id], "Đã xóa thành viên")}>
                        Xóa thành viên
                    </button>
                </>
            )
        );
    };

    return (
        <div className="group-detail-container">
            <div className="group-actions">
                {state.isRequestPending ? (
                    <button disabled>Đang chờ phê duyệt</button>
                ) : group.joined ? (
                    <>
                        <button onClick={() => setShowLeaveGroupPopup(true)}>Rời nhóm</button>
                        {state.userStatus === 1 && (
                            <>
                                <button onClick={() => updateState({ showModal: true })}>Sửa thông tin nhóm</button>
                                <button onClick={() => updateState({ showMembers: !state.showMembers })}>Danh sách thành viên</button>
                                <button onClick={() => updateState({ showJoinRequests: true })}>Danh sách lời mời</button>
                                <button onClick={() => navigate(`/pending-posts/${id}`)}>Bài viết chờ</button>
                            </>
                        )}
                        {state.userStatus === 2 && <button onClick={() => navigate(`/pending-posts/${id}`)}>Bài viết chờ</button>}
                    </>
                ) : (
                    <button onClick={() => handleAction(sendJoinGroupRequest, [id], "Yêu cầu tham gia nhóm đã được gửi.")}>
                        Yêu cầu tham gia nhóm
                    </button>
                )}

                {showLeaveGroupPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <p>Bạn có chắc chắn muốn rời nhóm?</p>
                            <button onClick={handleLeaveGroup}>Đồng ý</button>
                            <button onClick={() => setShowLeaveGroupPopup(false)}>Hủy</button>
                        </div>
                    </div>
                )}

            </div>


            {state.showMembers && (
                <div className="members-list">
                    <h6>Danh sách thành viên:</h6>
                    <ul>
                        {state.members.map((member) => (
                            <li key={member.id}>
                                <span>{member.fullName}</span>
                                <span className="role-label">{member.role === 1 ? "Quản trị viên" : member.role === 2 ? "Kiểm duyệt viên" : ""}</span>
                                {renderMemberActions(member)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {state.showJoinRequests && <GroupJoinRequests groupId={id} closeRequests={() => updateState({ showJoinRequests: false })} />}

            {!state.showMembers && !state.showJoinRequests && (
                <>
                    <form onSubmit={handleCreatePost}>
                        <textarea
                            value={state.newPostContent}
                            onChange={(e) => updateState({ newPostContent: e.target.value })}
                            placeholder="Nhập nội dung bài viết..."
                            rows="4"
                        />
                        <div>
                            {state.imageFiles.map((url, i) => (
                                <div key={i}>
                                    <img src={url} alt={`Ảnh ${i}`} />
                                    <button onClick={() => updateState({ imageFiles: state.imageFiles.filter((_, idx) => idx !== i) })}>
                                        Xóa
                                    </button>
                                </div>
                            ))}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    updateState({
                                        imageFiles: [...state.imageFiles, ...Array.from(e.target.files).map((file) => URL.createObjectURL(file))],
                                    })
                                }
                            />
                        </div>
                        <button type="submit">Đăng bài</button>
                    </form>

                    <ul>
                        {state.posts.length > 0 ? state.posts.map((post) => <PostPage key={post.id} postId={post.id} />) : <div>Không có bài viết nào.</div>}
                    </ul>
                </>
            )}

            <GroupEditModal show={state.showModal} handleClose={() => updateState({ showModal: false })} originalGroup={group} setOriginalGroup={setGroup} />
        </div>
    );
};

export default GroupDetail;