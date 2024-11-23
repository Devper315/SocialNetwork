import React, { useEffect, useState } from "react";
import { getCommentsByPostId, updateComment, deleteComment } from "../../services/commentService";
import { uploadImage } from "../../services/imageService";
import { Box, Typography, IconButton, Menu, MenuItem, TextField, Button, Avatar, } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [editedImageFile, setEditedImageFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuCommentId, setMenuCommentId] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await getCommentsByPostId(postId);
                setComments(response || []);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handleEditToggle = (commentId, content, imageUrl) => {
        setEditCommentId(commentId);
        setEditedContent(content);
        setEditedImageFile(null);
        setCurrentImageUrl(imageUrl);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditedImageFile(file);
            setCurrentImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (editCommentId === null) return;
        let imageUrl = currentImageUrl;
        if (editedImageFile) {
            try {
                imageUrl = await uploadImage(editedImageFile);
            } catch (error) {
                console.error("Failed to upload image:", error);
                return;
            }
        }
        const commentToUpdate = {
            id: editCommentId,
            content: editedContent || "",
            imageUrl: imageUrl || null,
        };

        try {
            const updatedComment = await updateComment(commentToUpdate);
            setComments((prev) =>
                prev.map((comment) => (comment.id === editCommentId ? updatedComment : comment))
            );
            setEditCommentId(null);
            setEditedContent("");
            setEditedImageFile(null);
            setCurrentImageUrl("");
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleMenuClick = (event, commentId) => {
        setAnchorEl(event.currentTarget);
        setMenuCommentId(commentId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuCommentId(null);
    };

    return (
        <Box sx={{ width: "100%", padding: "16px", backgroundColor: "#f9f9f9" }}>
            {comments.map(({ id, userName, content, imageUrl, time }) => (
                <Box
                    key={id}
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                        padding: "16px",
                        marginBottom: "16px",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Avatar sx={{ bgcolor: "#1976d2" }}>{userName.charAt(0)}</Avatar>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                {userName}
                            </Typography>
                        </Box>

                        <IconButton
                            aria-label="options"
                            onClick={(event) => handleMenuClick(event, id)}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={menuCommentId === id}
                            onClose={handleMenuClose}>
                            <MenuItem
                                onClick={() => {
                                    handleEditToggle(id, content, imageUrl);
                                    handleMenuClose();
                                }}>
                                <EditIcon sx={{ marginRight: "8px" }} />
                                Sửa
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleDelete(id);
                                    handleMenuClose();
                                }}>
                                <DeleteIcon sx={{ marginRight: "8px" }} />
                                Xóa
                            </MenuItem>
                        </Menu>
                    </Box>

                    {editCommentId === id ? (
                        <Box sx={{ marginTop: "16px" }}>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="Chỉnh sửa bình luận..."
                                sx={{ marginBottom: "16px" }}
                            />
                            {currentImageUrl && (
                                <Box sx={{ marginBottom: "16px", position: "relative" }}>
                                    <img
                                        src={currentImageUrl}
                                        alt="Preview"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "200px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ marginTop: "8px" }}
                                        onClick={() => setCurrentImageUrl("")}
                                    >
                                        Xóa ảnh
                                    </Button>
                                </Box>
                            )}
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<ImageIcon />}
                                sx={{ marginBottom: "16px" }}>
                                Chọn ảnh
                                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                            </Button>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditCommentId(null)}
                                >
                                    Hủy
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ marginTop: "16px" }}>
                            <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                                {content}
                            </Typography>
                            {imageUrl && (
                                <img src={imageUrl} alt={`Comment ${id}`}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "8px",
                                    }}/>
                            )}
                        </Box>
                    )}
                    <Typography
                        variant="caption"
                        sx={{ color: "gray", display: "block", marginTop: "8px" }}>
                        Thời gian: {new Date(time).toLocaleString()}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default CommentList;
