import React, { useEffect, useState } from 'react';
import { uploadFileToFirebase } from '../../configs/firebaseSDK';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Avatar, Typography } from '@mui/material';

const EditProfileModal = ({ showModal, handleCloseModal, profile, updateProfile }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateProfile = async () => {
        const avatarUrl = await uploadFileToFirebase(selectedImage, `avatars/${profile.username}`);
        let updatedData = { ...formData };
        if (avatarUrl) updatedData.avatarUrl = avatarUrl;
        updateProfile(updatedData);
        handleCloseModal();
    };

    return (
        <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
            <DialogTitle>Chỉnh Sửa Trang Cá Nhân</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Họ"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Tên"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Ngày sinh"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1">Avatar</Typography>
                    <Avatar
                        src={imagePreview || formData.avatarUrl}
                        alt="Avatar"
                        sx={{ width: 100, height: 100 }}
                    />
                    <Button variant="contained" component="label">
                        Tải lên ảnh
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">
                    Đóng
                </Button>
                <Button
                    onClick={handleUpdateProfile}
                    color="primary"
                    variant="contained"
                    disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth}
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;
