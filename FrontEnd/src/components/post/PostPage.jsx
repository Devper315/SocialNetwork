import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, IconButton, MenuItem, Paper, Popper, Typography } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"
import CommentIcon from "@mui/icons-material/Comment"
import PostDialog from './PostDialog';
import { uploadFileToFirebase, deleteFileFirebase } from "../../configs/firebaseSDK"
import { updatePost } from "../../services/postService"
import ZoomImage from '../common/ZoomImage';
import CommentList from './CommentList';


const PostPage = ({ post, editPostInList, setShowConfirmDelete, setPostToDelete, }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEditting, setIsEditing] = useState(false)
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(null)
    const [showComment, setShowComment] = useState(false)

    const handleZoom = (image) => {
        setSelectedUrl(image.url);
        setZoom(true)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
        setOpen((prev) => !prev)
    }

    const handleMenuClose = () => {
        setOpen(false)
    }

    const handleOpenEditDialog = () => {
        handleMenuClose()
        setIsEditing(true)
    }

    const handleClickDelete = () => {
        setShowConfirmDelete(true)
        setPostToDelete(post)
        handleMenuClose()
    }

    const handleUpdatePost = async (data) => {
        console.log(data)
        data.deleteImages.forEach(async (image) => {
            await deleteFileFirebase(image)
        })
        if (data.newImages.length > 0) {
            const imageIndexes = data.images
                .filter(image => image.id)
                .map(image => parseInt(image.filePath.split("-")[1]))
            const uploadPromises = data.newImages.map(async (image, index) => {
                let currentIndex = index
                while (imageIndexes.includes(currentIndex)) {
                    currentIndex += 1
                    if (!imageIndexes.includes(currentIndex)) {
                        imageIndexes.push(currentIndex)
                        break
                    }
                }
                const filePath = `post/${data.id}-${currentIndex}`
                const url = await uploadFileToFirebase(image.file, filePath)
                return { filePath, url }
            })
            const newImages = await Promise.all(uploadPromises)
            data.newImages = newImages
        }
        const updatedPost = await updatePost(data)
        editPostInList(updatedPost)
    }

    return (
        <>
            <Card key={post.id} sx={{
                borderRadius: "8px", boxShadow: 3, maxWidth: "600px", margin: "0 auto 20px",
            }}>
                <CardContent sx={{ paddingTop: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="subtitle2" color="text.primary"
                            sx={{ fontWeight: "bold", textAlign: "left" }}>
                            {post.author}
                        </Typography>
                        <div style={{ position: "relative" }}>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                            <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
                                <Paper
                                    sx={{
                                        padding: "8px", borderRadius: "4px", boxShadow: 3, position: "relative",
                                        zIndex: 1, backgroundColor: "#f5f5f5",
                                    }}>
                                    <div style={{
                                        position: "absolute", top: -10, right: 12, width: 0, height: 0,
                                        borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
                                        borderBottom: "10px solid #f0f0f0",
                                    }} />
                                    <MenuItem onClick={handleOpenEditDialog}>
                                        <EditIcon sx={{ marginRight: "8px" }} />
                                        Chỉnh sửa
                                    </MenuItem>
                                    <MenuItem onClick={handleClickDelete}>
                                        <DeleteIcon sx={{ marginRight: "8px" }} />
                                        Xóa
                                    </MenuItem>
                                </Paper>
                            </Popper>
                        </div>
                    </div>

                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left", display: "block", }}>
                        {post.time}
                    </Typography>

                    <Typography variant="body1" sx={{ marginTop: "8px", marginBottom: "16px", textAlign: "left" }}>
                        {post.content.split("\n").map(p =>
                            <>{p} <br /></>
                        )}
                    </Typography>

                    {post.images && post.images.length > 0 && (
                        <Grid container spacing={2}>
                            {post.images.sort((a, b) => { return a.id - b.id })
                                .map((image, index) => (
                                    <>
                                        <Grid item xs={12} sm={6} md={4} key={image.id} onClick={() => handleZoom(image)}>
                                            <CardMedia component="img" image={image.url} alt={`Ảnh ${index + 1}`}
                                                sx={{
                                                    borderRadius: "8px", maxHeight: "200px", objectFit: "cover",
                                                    '&:hover': { cursor: 'pointer' }
                                                }} />
                                        </Grid>
                                        <ZoomImage open={zoom} onClose={handleCloseZoom} imageSrc={selectedUrl} />
                                    </>
                                ))}
                        </Grid>
                    )}
                    <Divider sx={{ marginY: 2, borderWidth: "1.5px" }} />

                    <Button variant="contained" onClick={() => setShowComment(true)}
                        sx={{ backgroundColor: "#3578E5", color: "#fff", borderRadius: "20px", 
                            padding: "8px 16px", textTransform: "none", gap: "8px",
                            "&:hover": {
                                backgroundColor: "#2a65c8",
                            }}}>
                        <CommentIcon sx={{ fontSize: "20px" }} />
                        Bình luận
                    </Button>

                </CardContent>

                <PostDialog post={post} open={isEditting} onClose={() => setIsEditing(false)}
                    onSubmit={handleUpdatePost} />
                <CommentList post={post} open={showComment} onClose={() => setShowComment(false)} />
            </Card>

        </>
    )
}

export default PostPage;
