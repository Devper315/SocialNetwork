import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupById } from "../../../services/groupService";
import GroupEditModal from "./GroupEditModal";


const GroupDetail = () => {
    const { id } = useParams()
    const [group, setGroup] = useState({})
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        const getGroup = async () => {
            const data = await fetchGroupById(id)
            setGroup(data)
        }
        getGroup()
    }, [id])

    const requestJoinGroup = () => {
        console.log("tham gia")
    }

    const leaveGroup = () => {
        console.log("roi nhom")
    }

    const openEditModal = () => {
        setShowModal(true)
    }

    const closeEditModal = () => {
        setShowModal(false)
    }

    return (
        <div>
            <button onClick={openEditModal}>Sửa thông tin nhóm</button>
            <h6>Chi tiết nhóm</h6>
            <h6>{group.id + " " + group.name}</h6>
            <img src={group.imageUrl} alt="Ảnh nhóm" style={{width: 100, marginTop: 10}}/>
            <h6>{group.joined ? 'Đã tham gia' : 'Chưa tham gia'}</h6>
            {!group.joined && <button onClick={requestJoinGroup}>Yêu cầu tham gia nhóm</button>}
            {group.joined && <button onClick={leaveGroup}>Rời nhóm</button>}
            <GroupEditModal show={showModal} handleClose={closeEditModal}
                originalGroup={group} setOriginalGroup={setGroup}/>
        </div>

    )
}

export default GroupDetail