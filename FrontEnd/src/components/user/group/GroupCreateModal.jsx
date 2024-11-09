import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { createGroup } from "../../../services/groupService";

const GroupCreateModal = ({show, handleClose}) => {
    const [formData, setFormData] = useState({})
    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }


    const handleCreateGroup = () => {
        createGroup(formData)
        handleClose()
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tạo nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <label>Tên:</label>
                    <input name="name" value={formData.name || ''}
                    onChange={handleInputChange}
                    className="form-control"/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleCreateGroup}>Tạo</Button>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GroupCreateModal