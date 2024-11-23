import React, { useEffect, useState } from "react";
import { uploadFileToFirebase } from "../../configs/firebaseSDK";
import { updateGroup } from "../../services/groupService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
} from "@mui/material";

const GroupEditModal = ({ show, handleClose, originalGroup, setOriginalGroup }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(originalGroup);
  }, [originalGroup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    const imageUrl = await uploadFileToFirebase(selectedImage, `groups/${formData.id}`);
    if (imageUrl) formData.imageUrl = imageUrl;
    updateGroup(formData);
    setOriginalGroup(formData);
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Sửa thông tin nhóm</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Tên nhóm"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1">Ảnh nhóm</Typography>
          <Avatar
            src={imagePreview || formData.imageUrl}
            alt="Ảnh nhóm"
            sx={{ width: 100, height: 100 }}
          />
          <Button variant="contained" component="label">
            Tải lên ảnh
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupEditModal;
