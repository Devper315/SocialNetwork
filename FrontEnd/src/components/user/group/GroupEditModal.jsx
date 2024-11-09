import React, { useEffect, useState } from "react";
import { uploadFileToFirebase } from "../../../configs/firebaseSDK";
import { updateGroup } from "../../../services/groupService";
import { Button, ButtonGroup, Modal } from "react-bootstrap";

const GroupEditModal = ({ show, handleClose, originalGroup, setOriginalGroup }) => {
    const [selectedImage, setSelectedImage] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [formData, setFormData] = useState({})

    useEffect(() => {
        setFormData(originalGroup)
    }, [originalGroup])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

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

    const handleSave = async () => {
        const imageUrl = await uploadFileToFirebase(selectedImage, `groups/${formData.id}`)
        if (imageUrl) formData.imageUrl = imageUrl
        updateGroup(formData)
        setOriginalGroup(formData)
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Sửa thông tin nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <label>Tên:</label>
                    <input name="name" value={formData.name || ''}
                        className="form-control" onChange={handleInputChange} />
                </div>
                <div>
                    <label>Ảnh nhóm</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="form-control"/>
                    <img src={imagePreview || formData.imageUrl} alt="Ảnh nhóm" style={{width: 100, marginTop: 10}}/>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Lưu</Button>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GroupEditModal