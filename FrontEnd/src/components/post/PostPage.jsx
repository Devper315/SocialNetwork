import React, { useContext, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"
import CommentIcon from "@mui/icons-material/Comment"
import PostDialog from './PostDialog';
import { uploadFileToFirebase, deleteFileFirebase } from "../../configs/firebaseSDK"
import { approvePost, updatePost } from "../../services/postService"
import ZoomImage from '../common/ZoomImage';
import CommentList from './CommentList';
import { AuthContext } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';


const PostPage = ({ post, editPostInList, setShowConfirmDelete, setPostToDelete,
    userGroupContext, removePostFromList }) => {
    const { user } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditting, setIsEditing] = useState(false)
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(null)
    const [showComment, setShowComment] = useState(false)
    const [mustLogin, setMustLogin] = useState(false)
    const [approveDialog, setApproveDialog] = useState(false)

    const navigate = useNavigate()
    const canComment = post.approvalStatus !== "PENDING" && !post.approvalAction

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
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleOpenEditDialog = () => {
        setIsEditing(true)
        handleCloseMenu()
    }

    const handleClickDelete = () => {
        setShowConfirmDelete(true)
        setPostToDelete(post)
        handleCloseMenu()
    }

    const handleUpdatePost = async (data) => {
        data.deleteImages.forEach(async (image) => {
            await deleteFileFirebase(image.filePath)
        })
        if (userGroupContext && userGroupContext.member)
            data.approvalStatus = "PENDING"
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
        console.log(userGroupContext, data)
        if (data.approvalStatus !== "PENDING") editPostInList(updatedPost)
        else {
            removePostFromList(updatedPost)
            setApproveDialog(true)

        }
    }

    const handleApprove = (approve) => {
        const updatedPost = {
            ...post,
            approvalAction: approve ? "approve" : "reject",
            approvalStatus: approve ? "APPROVED" : "REJECTED"
        }
        approvePost(post.id, updatedPost.approvalStatus)
        editPostInList(updatedPost)
    }

    const handleOpenComment = () => {
        if (user)
            setShowComment(true)
        else {
            setMustLogin(true)
        }
    }
    const handleNavigate = (url) => {
        if (user) navigate(url)
    }

    return (
        <>
            <Card key={post.id} sx={{
                borderRadius: "8px", boxShadow: 3, mb: 2
            }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src={post.author.avatarUrl} onClick={() => handleNavigate(`/profile/${post.author.id}`)}
                            sx={{ width: "50px", height: "50px", cursor: user ? "pointer" : "default" }} />

                        <Box style={{ textAlign: "left" }}>
                            {post.groupId &&
                                <Typography variant="subtitle1" fontWeight="bold"
                                    sx={{ cursor: user ? "pointer" : "default" }}
                                    onClick={() => handleNavigate(`/group-detail/${post.groupId}`)}>
                                    {post.groupName}
                                </Typography>}
                            <Typography variant={post.groupId ? "caption" : "subtitle1"}
                                fontWeight="bold" sx={{ cursor: user ? "pointer" : "default" }}
                                onClick={() => handleNavigate(`/profile/${post.author.id}`)}>
                                {post.author.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: post.groupId ? 1 : 0 }}>
                                {format(post.time, 'HH:mm:ss dd/MM/yyyy')}
                            </Typography>
                        </Box>

                        {user && user.id === post.author.id &&
                            <Box sx={{ ml: "auto" }}>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    PaperProps={{
                                        sx: {
                                            border: "1px solid #ddd", borderRadius: '8px',
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}>
                                    <MenuItem onClick={handleOpenEditDialog}>
                                        <EditIcon sx={{ mr: "8px" }} />
                                        Chỉnh sửa
                                    </MenuItem>
                                    <MenuItem onClick={handleClickDelete}>
                                        <DeleteIcon sx={{ mr: "8px" }} />
                                        Xóa
                                    </MenuItem>
                                </Menu>
                            </Box>}
                    </Box>


                    <Typography variant="body1" sx={{
                        marginTop: "8px", marginBottom: "16px", textAlign: "left", whiteSpace: "pre-line"
                    }}>
                        {post.content}

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

                    {canComment &&
                        <Button variant="contained" onClick={handleOpenComment}
                            sx={{
                                backgroundColor: "#3578E5", color: "#fff", borderRadius: "20px",
                                textTransform: "none", gap: "8px",
                                "&:hover": {
                                    backgroundColor: "#2a65c8",
                                }
                            }}>
                            <CommentIcon sx={{ fontSize: "20px" }} />
                            Bình luận
                        </Button>}
                    {post.approvalStatus === "PENDING" &&
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="outlined" color="success" onClick={() => handleApprove(true)}
                                sx={{
                                    borderRadius: "20px", textTransform: "none", height: "40px",
                                    fontWeight: "bold", borderWidth: 1
                                }} >
                                Phê duyệt
                            </Button>
                            <Button variant='outlined' color="error" onClick={() => handleApprove(false)}
                                sx={{
                                    borderRadius: "20px", textTransform: "none", height: "40px",
                                    fontWeight: "bold", borderWidth: 1
                                }} >
                                Từ chối
                            </Button>
                        </Box>
                    }
                    {post.approvalAction === 'approve' &&
                        <Box sx={{
                            display: "flex", alignItems: "center", backgroundColor: "#4caf50", width: "fit-content",
                            color: "white", borderRadius: "20px", padding: '4px 10px',
                        }}>
                            <CheckCircleOutlineIcon sx={{ marginRight: "5px" }} />
                            <Typography fontWeight={"bold"} sx={{ mr: 1 }}>Đã phê duyệt</Typography>
                        </Box>}
                    {post.approvalAction === 'reject' &&
                        <Box sx={{
                            display: "flex", alignItems: "center", backgroundColor: "#e57373", width: "fit-content",
                            color: "white", borderRadius: "20px", padding: '4px 10px',
                        }}>
                            <CancelOutlinedIcon sx={{ marginRight: "5px" }} />
                            <Typography fontWeight={"bold"} sx={{ mr: 1 }}>Đã từ chối</Typography>
                        </Box>}
                </CardContent>

                <PostDialog post={post} open={isEditting} onClose={() => setIsEditing(false)}
                    onSubmit={handleUpdatePost} />
                <CommentList post={post} open={showComment} onClose={() => setShowComment(false)} />
            </Card>

            <Dialog open={mustLogin} onClose={() => setMustLogin(false)}>
                <DialogTitle sx={{
                    display: "flex", gap: 1, alignItems: "center", p: "5px 23px",
                    borderBottom: "1px solid #ccc", mb: 1
                }}>
                    Bình luận
                </DialogTitle>
                <DialogContent>
                    <Typography>Bạn cần đăng nhập để xem bình luận</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => navigate("/login")}
                        sx={{ textTransform: "none", fontWeight: "bold" }}>
                        OK
                    </Button>
                    <Button variant="outlined" onClick={() => setMustLogin(false)}
                        sx={{ textTransform: "none", fontWeight: "bold" }}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={approveDialog} onClose={() => setApproveDialog(false)}>
                <DialogTitle sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: "1px solid #ccc", py: 1
                }}>
                    Thông báo

                </DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Typography fontSize={17} sx={{ whiteSpace: "pre-line" }}>
                        {`Chỉnh sửa viết thành công.
                          Vui lòng chờ quản trị viên phê duyệt bài viết của bạn.`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={() => setApproveDialog(false)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default PostPage;
