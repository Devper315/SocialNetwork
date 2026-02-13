import React, { useState, useEffect } from "react";
import { fetchGroupJoinRequests, actionJoinGroupRequest } from "../../services/groupService";

const GroupJoinRequests = ({ groupId, closeRequests }) => {
    const [joinRequests, setJoinRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const requests = await fetchGroupJoinRequests(groupId);
                setJoinRequests(requests);
            } catch {
                alert("Không thể tải danh sách yêu cầu.");
            }
        };
        fetchRequests();
    }, [groupId]);

    const handleActionJoinRequest = async (requestId, accept) => {
        try {
            await actionJoinGroupRequest(requestId, accept);
            alert(accept ? "Đã đồng ý yêu cầu." : "Đã từ chối yêu cầu.");
            setJoinRequests((prev) => prev.filter((req) => req.id !== requestId));
        } catch {
            alert("Có lỗi xảy ra khi xử lý yêu cầu.");
        }
    };

    return (
        <div className="join-requests-list">
            <h6>Danh sách lời mời tham gia</h6>
            <button onClick={closeRequests}>Đóng</button>
            <ul>
                {joinRequests.length > 0 ? (
                    joinRequests.map((request) => (
                        <li key={request.id}>
                            {`${request.userFullName} đã gửi lời mời tham gia nhóm ${request.groupName}`}
                            <div>
                                <button onClick={() => handleActionJoinRequest(request.id, 1)}>Đồng ý</button>
                                <button onClick={() => handleActionJoinRequest(request.id, 0)}>Từ chối</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <div>Không có lời mời tham gia.</div>
                )}
            </ul>
        </div>
    );
};

export default GroupJoinRequests;
