import React, { useState } from "react";
import { Avatar, Box, CardMedia, CircularProgress, Grid, IconButton, MenuItem, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ZoomImage from "../common/ZoomImage";
import TextInput from "../common/TextInput";

const Comment = ({ comment, removeCommentFromList }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleClickEdit = () => {
        setIsEditing(true)
        setShowMenu(false)
    }

    const handleClickDelete = (comment) => {
        removeCommentFromList(comment)
        setShowConfirmDelete(true)
        setShowMenu(false)
    }

    const handleZoom = () => {
        setSelectedUrl(comment.imageUrl);
        setZoom(true)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }

    const handleEditComment = async (editedComment) => {
        setIsEditing(false)
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
    }

    return (
        <>
            <Box sx={{
                position: "relative",
                marginBottom: "3px",
                marginLeft: "25px",
                padding: "10px",
                borderRadius: "20px",
                backgroundColor: "#D3D3D3",
                maxWidth: "70%"
            }}>

                <Box display="flex" alignItems="center" ver gap={1} sx={{ position: "relative" }}>
                    <Avatar src={comment.authorAvatar} sx={{ position: "absolute", left: "-55px" }} />
                    <Typography variant="subtitle1" fontWeight="bold" fontSize={13}>
                        {comment.author}
                    </Typography>
                    <Typography variant="subtitle1" fontSize={13}>
                        {"20:20 31/05/2024"}
                    </Typography>
                </Box>
                {isEditing && <TextInput handleSubmit={handleEditComment} type="comment" editingComment={comment} />}
                {isLoading &&
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={30} />
                    </Box>}
                {!isEditing && !isLoading &&
                    <>
                        <Typography variant="body2" color="text.secondary">
                            {comment.content}
                        </Typography>
                        <IconButton onClick={() => setShowMenu(!showMenu)}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: "-40px",
                                transform: "translateY(-50%)",
                            }}>
                            <MoreVertIcon />
                        </IconButton>
                    </>}
                {showMenu && <Box sx={{
                    position: "absolute", top: "80%",
                    right: "-38px",
                }}>
                    <Paper
                        sx={{
                            padding: "8px", borderRadius: "4px", boxShadow: 3, position: "relative",
                            zIndex: 1, backgroundColor: "#f5f5f5", fontSize: "13px"
                        }}>
                        <div style={{
                            position: "absolute", top: -10, right: 10, width: 0, height: 0,
                            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
                            borderBottom: "10px solid #f0f0f0",
                        }} />
                        <MenuItem onClick={handleClickEdit} sx={{ fontSize: "14px" }}>
                            <EditIcon sx={{ marginRight: "8px", fontSize: "16px" }} />
                            Chỉnh sửa
                        </MenuItem>
                        <MenuItem onClick={() => handleClickDelete(comment)} sx={{ fontSize: "14px" }}>
                            <DeleteIcon sx={{ marginRight: "8px", fontSize: "16px" }} />
                            Xóa
                        </MenuItem>
                    </Paper>
                </Box>}

            </Box>

            <Grid item xs={12} sm={6} md={4} sx={{ marginLeft: "25px", marginBottom: "12px" }} >
                {comment.imageUrl &&
                    <>
                        <CardMedia component="img" image={comment.imageUrl} alt="Ảnh" onClick={handleZoom}
                            sx={{
                                borderRadius: "8px", maxHeight: "100px", maxWidth: "100px", objectFit: "cover",
                                '&:hover': { cursor: 'pointer' }
                            }} />
                        <ZoomImage open={zoom} onClose={handleCloseZoom} imageSrc={selectedUrl} />
                    </>}
            </Grid>
        </>
    );
};

export default Comment;
