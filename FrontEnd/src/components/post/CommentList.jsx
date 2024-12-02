import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Comment from "./Comment";
import TextInput from "../common/TextInput"
import { format } from "date-fns";
import { createComment, deleteComment, deleteCommentById, fetchCommentsByPostId, updateComment } from "../../services/commentService";
import { AuthContext } from "../../contexts/AuthContext"
import { uploadFileToFirebase } from "../../configs/firebaseSDK";

const CommentList = ({ post, open, onClose }) => {
    const [comments, setComments] = useState([])
    const [headLoading, setHeadLoading] = useState(false)
    const [footLoading, setFootLoading] = useState(false)

    useEffect(() => {
        if (!open) {
            setComments([])
            return
        }
        const getCommentsByPost = async () => {
            setHeadLoading(true)
            const commentData = await fetchCommentsByPostId(post.id)
            await new Promise(resolve => setTimeout(resolve, 1000))
            setComments(commentData)
            setHeadLoading(false)
        }
        getCommentsByPost()
    }, [open])

    const handleAddComment = async (text, image) => {
        setFootLoading(true)
        if (text.trim() === "") return;
        let newComment = {
            postId: post.id,
            content: text,
        }
        newComment = await createComment(newComment)
        console.log(newComment)
        if (image) {
            const filePath = `comment/${newComment.id}`
            const imageUrl = await uploadFileToFirebase(image, filePath)
            newComment.imageUrl = imageUrl
        }
        console.log(newComment)
        await new Promise(resolve => setTimeout(resolve, 500))
        setFootLoading(false)
        updateComment(newComment)
        setComments([...comments, newComment])
    }

    const removeCommentFromList = (comment) => {
        setComments(comments.filter(c => c.id !== comment.id))
        deleteCommentById(comment.id)
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle fontWeight={"bold"}>
                Bình luận cho bài viết của {post.author}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{ position: "absolute", right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ minHeight: "120px" }}>
                {headLoading &&
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={30} />
                    </Box>}
                {open && comments.length === 0 && !headLoading &&
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", marginTop: "20px" }}>
                        Chưa có bình luận nào
                    </Typography>}
                {comments.length > 0 && comments.map(comment => (
                    <Comment key={comment.id} comment={comment}
                        removeCommentFromList={removeCommentFromList} />
                ))}
                {footLoading &&
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={30} />
                    </Box>}
            </DialogContent>
            <TextInput handleSubmit={handleAddComment} type="comment" />
        </Dialog>
    )
}

export default CommentList