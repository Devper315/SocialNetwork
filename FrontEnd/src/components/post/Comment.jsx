import React, { useContext, useState } from "react"
import { Avatar, Box, CardMedia, CircularProgress, Grid, IconButton, MenuItem, Paper, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ZoomImage from "../common/ZoomImage"
import TextInput from "../common/TextInput"
import { deleteFileFirebase, uploadFileToFirebase } from "../../configs/firebaseSDK"
import { updateComment } from "../../services/commentService"
import { AuthContext } from "../../contexts/AuthContext"
import { format } from 'date-fns'

const Comment = ({ comment, removeCommentFromList, editCommentInList }) => {
    const { user } = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const display = !isEditing && !isLoading

    const handleClickEdit = () => {
        setIsEditing(true)
        setShowMenu(false)
    }

    const handleClickDelete = (comment) => {
        removeCommentFromList(comment)
        setShowMenu(false)
    }

    const handleZoom = () => {
        setSelectedUrl(comment.imageUrl)
        setZoom(true)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }

    const handleEditComment = async (editedComment) => {
        setIsEditing(false)
        setIsLoading(true)
        const filePath = `comment/${editedComment.id}`
        if (editedComment.newImage) {
            const newImageUrl = await uploadFileToFirebase(editedComment.newImage, filePath)
            editedComment.imageUrl = newImageUrl
        }
        if (!editedComment.imageUrl) {
            deleteFileFirebase(filePath)
        }
        setIsLoading(false)
        updateComment(editedComment)
        editCommentInList(editedComment)
    }

    return (
        <Box sx={{ mb: 1 }}>
            <Box display="flex" gap={1}>
                <Avatar src={comment.authorAvatar} />
                <Box >
                    <Box sx={{ borderRadius: "20px", backgroundColor: "#D3D3D3", p: "10px" }}>
                        <Box display="flex" alignItems="center" gap={1}
                            sx={{ position: "relative" }}>
                            <Typography variant="subtitle1" fontWeight="bold" fontSize={13}>
                                {comment.author}
                            </Typography>
                            <Typography variant="subtitle1" fontSize={13}>
                                {format(comment.time, 'HH:mm:ss dd/MM/yyyy')}
                            </Typography>
                        </Box>
                        {!isEditing && !isLoading &&
                            <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                                {comment.content}
                            </Typography>}
                    </Box>

                    {display && comment.imageUrl &&
                        <>
                            <CardMedia component="img" image={comment.imageUrl} onClick={handleZoom}
                                sx={{
                                    borderRadius: 3, maxHeight: "100px", maxWidth: "100px", objectFit: "cover",
                                    cursor: 'pointer', marginTop: "5px"
                                }} />
                            <ZoomImage open={zoom} onClose={handleCloseZoom} imageSrc={selectedUrl} />
                        </>
                    }
                </Box>
                {display && user.username === comment.authorUsername &&
                    <Box position="relative">
                        <IconButton onClick={() => setShowMenu(!showMenu)} >
                            <MoreVertIcon />
                        </IconButton>
                        {showMenu &&
                            <Box sx={{
                                position: "absolute", top: "45px", left: "-7px",
                                borderRadius: "4px", boxShadow: 3,
                                zIndex: 1, backgroundColor: "#f5f5f5"
                            }}>
                                <Box sx={{
                                    position: "absolute", top: -10, left: 18,
                                    borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
                                    borderBottom: "10px solid #f5f5f5",
                                }} />
                                <MenuItem onClick={handleClickEdit} sx={{ fontSize: "15px" }}>
                                    <EditIcon sx={{ marginRight: "8px" }} fontSize="small" />
                                    Chỉnh sửa
                                </MenuItem>
                                <MenuItem onClick={() => handleClickDelete(comment)} sx={{ fontSize: "15px" }}>
                                    <DeleteIcon sx={{ marginRight: "8px" }} fontSize="small" />
                                    Xóa
                                </MenuItem>
                            </Box>}
                    </Box>
                }
            </Box>

            {isEditing && <TextInput handleSubmit={handleEditComment} type="comment" comment={comment} />}
            {isLoading &&
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>}

        </Box>
    )
}

export default Comment
