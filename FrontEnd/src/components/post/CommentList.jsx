import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Comment from "./Comment";
import TextInput from "../common/TextInput"
import { createComment, deleteCommentById, fetchCommentsByPostId, updateComment } from "../../services/commentService";
import { deleteFileFirebase, uploadFileToFirebase } from "../../configs/firebaseSDK";

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
            setComments(commentData)
            setHeadLoading(false)
        }
        getCommentsByPost()
    }, [open])

    const handleAddComment = async (inputComment) => {
        setFootLoading(true)
        if (inputComment.content === "") return;
        let newComment = {
            postId: post.id,
            content: inputComment.content,
        }
        newComment = await createComment(newComment)
        if (inputComment.newImage) {
            const filePath = `comment/${newComment.id}`
            const imageUrl = await uploadFileToFirebase(inputComment.newImage, filePath)
            newComment.imageUrl = imageUrl
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        setFootLoading(false)
        console.log(newComment)
        updateComment(newComment)
        setComments([...comments, newComment])
    }

    const editCommentInList = (editedComment) => {
        setComments(comments.map(c => c.id === editedComment.id ? editedComment : c))
    }

    const removeCommentFromList = (comment) => {
        setComments(comments.filter(c => c.id !== comment.id))
        deleteFileFirebase(`comment/${comment.id}`)
        deleteCommentById(comment.id)
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle fontWeight={"bold"} display="flex" justifyContent="space-between" alignItems="center">
                Bình luận cho bài viết của {post.author}
                <IconButton onClick={onClose}>
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
                    <Comment key={comment.id} comment={comment} editCommentInList={editCommentInList}
                        removeCommentFromList={removeCommentFromList} />
                ))}
                {footLoading &&
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>}
            </DialogContent>
            <TextInput handleSubmit={handleAddComment} type="comment" />
        </Dialog>
    )
}

export default CommentList