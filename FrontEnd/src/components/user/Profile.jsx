import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createFriendRequest, actionFriendRequestByUserId, unfriend } from "../../services/friendService"
import { fetchProfileById, updateMyProfile } from '../../services/profileService'
import EditProfileModal from './EditProfileModal'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState({})
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const getProfile = async () => {
            const profileData = await fetchProfileById(id)
            setProfile(profileData)
        }
        getProfile()
    }, [id])

    const sendFriendRequest = () => {
        createFriendRequest(profile.id)
        setProfile({ ...profile, sentRequest: true, toSendRequest: false })
    }

    const updateFriendRequest = (accept) => {
        setProfile(prev => ({
            ...prev,
            friend: accept,
            hasRequest: false,
            sentRequest: false,
            toSendRequest: !accept
        }))
        actionFriendRequestByUserId(profile.id, accept)
    }

    const handleUnfriend = () => {
        unfriend(profile.id)
        setProfile({ ...profile, friend: false, toSendRequest: true })
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }
    const updateProfile = async (updatedData) => {
        await updateMyProfile(updatedData)
        setProfile(updatedData)
    }


    return (
        <div className="profile-page">
            <h1>Trang Cá Nhân</h1>
            <div className="profile-info">
                <img src={profile.avatarUrl} alt="Avatar" className="avatar" width={100} />
                <h2>{`${profile.firstName} ${profile.lastName} - id: ${profile.id}`}</h2>
                <p><strong>Tên đăng nhập:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Ngày sinh:</strong> {profile.dateOfBirth}</p>
                {profile.myProfile && (
                    <button onClick={() => setShowModal(true)}>Sửa trang cá nhân</button>
                )}

                {profile.friend && (
                    <button onClick={handleUnfriend}>Hủy kết bạn</button>
                )}

                {profile.toSendRequest && (
                    <button onClick={sendFriendRequest}>Gửi kết bạn</button>
                )}

                {profile.hasRequest && (
                    <div>
                        <button onClick={() => updateFriendRequest(true)}>Chấp nhận kết bạn</button>
                        <button onClick={() => updateFriendRequest(false)}>Từ chối</button>
                    </div>
                )}
                {profile.sentRequest && (
                    <div>
                        <span>Đã gửi yêu cầu kết bạn</span>
                        <button onClick={() => updateFriendRequest(false)}>Hủy yêu cầu kết bạn</button>
                    </div>
                )}
            </div>
            <EditProfileModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                profile={profile}
                updateProfile={updateProfile} />
        </div>
    )
}

export default Profile
