import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

const PostDialog = ({ open, onClose, onSubmit, post }) => {
    const [content, setContent] = useState("");
    const [currentImages, setCurrentImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [deleteImages, setDeleteImages] = useState([])

    useEffect(() => {
        if (post) {
            setContent(post.content || "");
            setCurrentImages(
                (post.images).map(image => ({
                    id: image.id, filePath: image.filePath, url: image.url,
                }))
            )
        } else {
            setContent("");
            setCurrentImages([]);
        }
        return () => {
            setContent("");
            setCurrentImages([]);
            setNewImages([])
            setDeleteImages([])
        }
    }, [post, open]);

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImages(prev => [...prev, { file, url: reader.result }])
                setNewImages(prev => [...prev, { file, url: reader.result }])
            }
            reader.readAsDataURL(file);
        })
    }

    const handleRemoveImage = (image, index) => {
        setCurrentImages(currentImages.filter((_, i) => i !== index))
        if (image.id) setDeleteImages([...deleteImages, image])
    }

    const handleSubmit = () => {
        const data = { ...post, content, images: currentImages, newImages, deleteImages }
        onSubmit(data)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {post ? "Chỉnh sửa bài viết" : "Tạo mới bài viết"}
                <IconButton
                    sx={{ position: "absolute", right: 8, top: 8 }}
                    onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <TextField label="Nội dung bài viết" placeholder="Aa" multiline rows={4}
                    fullWidth value={content} onChange={(e) => setContent(e.target.value)} variant="outlined"
                    sx={{
                        marginBottom: "16px",
                        backgroundColor: "rgba(25, 118, 210, 0.05)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#1976d2",
                                borderRadius: "16px",
                            },
                            "&:hover fieldset": {
                                borderColor: "#1565c0",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1565c0",
                                borderWidth: "2px",
                            },
                        },
                    }} />
                <Box>
                    <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />}
                        sx={{ marginBottom: "16px", borderRadius: "10px", }}>
                        Thêm ảnh
                        <input type="file" hidden multiple accept="image/*" onChange={handleAddImage} />
                    </Button>
                    <Box
                        sx={{
                            display: "grid", gap: "8px",
                            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))"
                        }}>
                        {currentImages.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    position: "relative", width: "100%", height: "100px",
                                    overflow: "hidden", borderRadius: "8px",
                                }}>
                                <Box component="img" src={image.url} alt={`Image ${index}`}
                                    sx={{
                                        width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px",
                                    }} />
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.6)", color: "white",
                                    }}
                                    onClick={() => handleRemoveImage(image, index)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Lưu
                </Button>
                <Button onClick={onClose}  variant="outlined">
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PostDialog;
