import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { createGroup } from '../../services/groupService';

const GroupCreateModal = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateGroup = () => {
        createGroup(formData);
        handleClose();

    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Tạo nhóm</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Tên nhóm"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Hủy
                </Button>
                <Button
                    onClick={handleCreateGroup}
                    color="primary"
                    variant="contained"
                    disabled={!formData.name}
                >
                    Tạo
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GroupCreateModal;
