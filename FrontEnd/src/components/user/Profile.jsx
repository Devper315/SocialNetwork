import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProfileById } from "../../services/profileService";


const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState({})
    useEffect(() => {
        const getProfile = async () => {
            const profileData = await fetchProfileById(id)
            console.log("Đang lấy profile", profileData)
            setProfile(profileData)
        }
        getProfile()
    }, [id])

    const sendFriendRequest = () => {

    }

    const actionFriendRequest = (accept) => {

    }

    return (
        <div className="profile-page">
            <h1>Trang Cá Nhân</h1>
            <div className="profile-info">
                <img src={profile.avatar} alt="Avatar" className="avatar" />
                <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
                <p><strong>Tên đăng nhập:</strong> {profile.profilename}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Ngày sinh:</strong> {profile.dateOfBirth}</p>
                {profile.myProfile && <button>Sửa trang cá nhân</button>}
                {profile.friend && <button>Hủy kết bạn</button>}
                {!profile.hasRequestFriend && !profile.sentRequestFriend
                && !profile.myProfile && <button onClick={() => sendFriendRequest()}>Gửi kết bạn</button>}
                {profile.hasRequestFriend && <button onClick={() => actionFriendRequest(true)}>Chấp nhận kết bạn</button>}
                {profile.sentRequestFriend && <button>Đã gửi yêu cầu kết bạn</button>}
            </div>
        </div>
    );
}

export default Profile;
