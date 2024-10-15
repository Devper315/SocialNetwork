import React from 'react';
import "../../assets/styles/user/MyProfile.css"

const MyProfile = () => {
  // Dữ liệu người dùng mẫu
  const user = {
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    username: 'nguyenvana',
    email: 'nguyenvana@example.com',
    avatar: 'path/to/avatar.jpg', 
    dateOfBirth: '1990-01-01',
  };

  return (
    <div className="profile-page">
      <h1>Trang Cá Nhân</h1>
      <div className="profile-info">
        <img src={user.avatar} alt="Avatar" className="avatar" />
        <h2>{`${user.firstName} ${user.lastName}`}</h2>
        <p><strong>Tên đăng nhập:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Ngày sinh:</strong> {user.dateOfBirth}</p>
      </div>
    </div>
  );
};

export default MyProfile;
