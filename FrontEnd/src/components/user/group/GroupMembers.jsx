import React from "react";
import PropTypes from "prop-types";

const GroupMembers = ({ members, onClose }) => {
    return (
        <div className="members-list">
            <h6>Danh sách thành viên:</h6>
            <button onClick={onClose}>Đóng</button>
            <ul>
                {members.map((member) => (
                    <li key={member.id}>{member.fullName}</li>
                ))}
            </ul>
        </div>
    );
};

GroupMembers.propTypes = {
    members: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GroupMembers;
