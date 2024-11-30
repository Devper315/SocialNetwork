import React, { useState } from "react"
import { Box, Button } from "@mui/material"
import PostDialog from "./PostDialog"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { createPost, updatePost } from "../../services/postService"
import { uploadFileToFirebase } from "../../configs/firebaseSDK"

const CreatePost = ({ addPostToList, setHeadLoading }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleCreate = () => setDialogOpen(true)

    const handleSubmit = async (data) => {
        setHeadLoading(true)
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
            console.log(newPost)
            newPost = await updatePost(newPost)
        }
        addPostToList(newPost)
        setHeadLoading(false)
    }

    return (
        <Box sx={{ padding: "5px", position: "relative", right: 160, textAlign: "center" }}>
            <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleCreate}
                sx={{
                    padding: "10px 20px", fontSize: "16px", fontWeight: "bold",
                    borderRadius: "20px", marginTop: "16px", borderColor: "#1976d2", color: "#1976d2",
                    "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        borderColor: "#1565c0",
                    },
                }}>
                Tạo mới bài viết
            </Button>

            <PostDialog open={dialogOpen} onSubmit={handleSubmit}
                onClose={() => setDialogOpen(false)} />
        </Box>
    )
}

export default CreatePost
