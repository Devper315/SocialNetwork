import React, { useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import PostDialog from "./PostDialog"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { createPost, updatePost } from "../../services/postService"
import { uploadFileToFirebase } from "../../configs/firebaseSDK"

const CreatePost = ({ addPostToList, setHeadLoading, group, userGroupContext }) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [approveDialog, setApproveDialog] = useState(false)

    const handleCreate = () => setDialogOpen(true)

    const handleSubmit = async (data) => {
        setHeadLoading(true)
        if (group) {
            data.groupId = group.id
            if (userGroupContext.member) data.approvalStatus = "PENDING"
            else data.approvalStatus = "APPROVED"
        }
        let newPost = await createPost(data)
        if (data.images.length > 0) {
            const uploadPromises = data.images.map(async (image, index) => {
                const filePath = `post/${newPost.id}-${index}`
                const url = await uploadFileToFirebase(image.file, filePath)
                return { filePath, url }
            })
            const images = await Promise.all(uploadPromises)
            newPost = {
                ...newPost, images, newImages: images, deleteImages: []
            }
            newPost = await updatePost(newPost)
        }
        if (newPost.approvalStatus !== "PENDING") addPostToList(newPost)
        else setApproveDialog(true)
        setHeadLoading(false)
    }

    return (
        <Box sx={{ mb: "20px", textAlign: "left" }}>
            <Button variant="outlined" onClick={handleCreate}
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                    fontSize: "16px", fontWeight: "bold",
                    borderRadius: "20px", borderColor: "#1976d2", color: "#1976d2",
                    "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        borderColor: "#1565c0",
                    },
                }}>
                Tạo mới bài viết
            </Button>
            <PostDialog open={dialogOpen} onSubmit={handleSubmit}
                onClose={() => setDialogOpen(false)} />

            <Dialog open={approveDialog} onClose={() => setApproveDialog(false)}>
                <DialogTitle sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: "1px solid #ccc", py: 1
                }}>
                    Thông báo

                </DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Typography fontSize={17} sx={{ whiteSpace: "pre-line" }}>
                        {`Tạo bài viết thành công.
                        Vui lòng chờ quản trị viên phê duyệt bài viết của bạn.`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={() => setApproveDialog(false)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CreatePost
