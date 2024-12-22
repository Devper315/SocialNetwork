import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, Modal, Stack, Divider, Paper } from '@mui/material';

function ProfilePage({ profile, updateProfile, handleUnfriend, sendFriendRequest, updateFriendRequest }) {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
            {/* Tiêu đề */}
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Trang Cá Nhân
            </Typography>

            {/* Thông tin người dùng */}
            <Stack direction="column" alignItems="center" spacing={2}>
                <Avatar src={profile.avatarUrl} alt="Avatar" sx={{ width: 120, height: 120, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {`${profile.firstName} ${profile.lastName} - ID: ${profile.id}`}
                </Typography>
                <Typography variant="body1">
                    <strong>Tên đăng nhập:</strong> {profile.username}
                </Typography>
                <Typography variant="body1">
                    <strong>Email:</strong> {profile.email}
                </Typography>
                <Typography variant="body1">
                    <strong>Ngày sinh:</strong> {profile.dateOfBirth}
                </Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Nút hành động */}
            <Stack direction="column" spacing={2} alignItems="center">
                {profile.myProfile && (
                    <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
                        Sửa trang cá nhân
                    </Button>
                )}
                {profile.friend && (
                    <Button variant="outlined" color="error" onClick={handleUnfriend}>
                        Hủy kết bạn
                    </Button>
                )}
                {profile.toSendRequest && (
                    <Button variant="contained" color="success" onClick={sendFriendRequest}>
                        Gửi kết bạn
                    </Button>
                )}
                {profile.hasRequest && (
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" onClick={() => updateFriendRequest(true)}>
                            Chấp nhận kết bạn
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => updateFriendRequest(false)}>
                            Từ chối
                        </Button>
                    </Stack>
                )}
                {profile.sentRequest && (
                    <Stack direction="column" alignItems="center">
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            Đã gửi yêu cầu kết bạn
                        </Typography>
                        <Button variant="outlined" color="warning" onClick={() => updateFriendRequest(false)}>
                            Hủy yêu cầu kết bạn
                        </Button>
                    </Stack>
                )}
            </Stack>

            {/* Modal chỉnh sửa hồ sơ */}
            <Modal open={showModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Chỉnh sửa trang cá nhân
                    </Typography>
                    {/* Nội dung modal chỉnh sửa hồ sơ */}
                    <Button variant="contained" color="primary" onClick={handleCloseModal}>
                        Lưu thay đổi
                    </Button>
                </Box>
            </Modal>
        </Paper>
    );
}

export default ProfilePage;
