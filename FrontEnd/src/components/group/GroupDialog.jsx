import React, { useEffect, useState } from "react"
import { uploadFileToFirebase } from "../../configs/firebaseSDK"
import { updateGroup } from "../../services/groupService"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, CardMedia, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

const GroupDialog = ({ open, onClose, onSubmit, group }) => {
    const [selectedImage, setSelectedImage] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [form, setForm] = useState({})
    const saveDisabled = !form.name || !form.description

    useEffect(() => {
        if (group)
            setForm(group)
    }, [group])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
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

    const handleSubmit = async () => {
        const data = { ...form, image: selectedImage }
        onSubmit(data)
        onClose()
        setForm({})
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: 1, borderBottom: "1px solid #ccc"
            }}>
                {form.id ? "Sửa thông tin nhóm" : "Tạo nhóm mới"}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Tên nhóm" name="name" value={form.name}
                    onChange={handleInputChange} variant="outlined" sx={{ my: 2 }} />

                <TextField fullWidth label="Mô tả" name="description" value={form.description}
                    maxRows={3} multiline
                    variant="outlined" onChange={handleInputChange} sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1">Ảnh nhóm</Typography>
                    {(imagePreview || form.imageUrl) &&
                        <CardMedia component="img" src={imagePreview || form.imageUrl}
                            sx={{ width: "auto", maxHeight: 200 }} />}
                    <Button variant="contained" component="label">
                        Tải lên ảnh
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary" variant="contained"
                    disabled={saveDisabled}
                    sx={{ textTranform: "none", fontWeight: "bold" }}>
                    Lưu
                </Button>
                <Button onClick={onClose} variant="outlined" sx={{ textTranform: "none", fontWeight: "bold" }}>
                    Hủy
                </Button>

            </DialogActions>
        </Dialog>
    )
}

export default GroupDialog
