import React, { useEffect, useState } from "react"
import { uploadFileToFirebase } from "../../configs/firebaseSDK"
import { updateGroup } from "../../services/groupService"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, CardMedia, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

const GroupEditDialog = ({ show, handleClose, group, setGroup }) => {
    const [selectedImage, setSelectedImage] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [formData, setFormData] = useState({})

    useEffect(() => {
        setFormData(group)
    }, [group])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        const imageUrl = await uploadFileToFirebase(selectedImage, `groups/${formData.id}`)
        if (imageUrl) formData.imageUrl = imageUrl
        updateGroup(formData)
        setGroup(formData)
        handleClose()
    }

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: 1, borderBottom: "1px solid #ccc"
            }}>
                Sửa thông tin nhóm
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Tên nhóm" name="name" value={formData.name}
                    onChange={handleInputChange} variant="outlined" sx={{ my: 2 }} />

                <TextField fullWidth label="Mô tả" name="description" value={formData.description}
                    maxRows={3} multiline
                    variant="outlined" onChange={handleInputChange} sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1">Ảnh nhóm</Typography>
                    {(imagePreview || formData.imageUrl) &&
                        <CardMedia component="img" src={imagePreview || formData.imageUrl}
                            sx={{ width: "auto", maxHeight: 200 }} />}
                    <Button variant="contained" component="label">
                        Tải lên ảnh
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Lưu
                </Button>
                <Button onClick={handleClose} variant="outlined">
                    Hủy
                </Button>

            </DialogActions>
        </Dialog>
    )
}

export default GroupEditDialog
