// EditProfileModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, uploadFileToFirebase } from '../../configs/firebaseSDK';

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
        setFormData({ ...formData, [name]: value })
    };

    const handleUpdateProfile = async () => {
        const avatarUrl = await uploadFileToFirebase(selectedImage, `avatars/${profile.username}`);
        let updatedData = {...formData}
        if (avatarUrl)
            updatedData.avatarUrl = avatarUrl
        updateProfile(updatedData);
        handleCloseModal();
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh Sửa Trang Cá Nhân</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <label>Họ:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        className="form-control"/>
                </div>
                <div>
                    <label>Tên:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        className="form-control"/>
                </div>
                <div>
                    <label>Ngày sinh:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={handleInputChange}
                        className="form-control" />
                </div>
                <div>
                    <label>Avatar:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <img src={imagePreview || formData.avatarUrl} alt="Avatar" style={{ width: '100px', marginTop: '10px' }} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleUpdateProfile} disabled={!formData.fullName || !formData.email || !formData.dateOfBirth}>
                    Xác nhận
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProfileModal;
