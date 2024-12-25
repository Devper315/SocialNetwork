import React, { useContext, useEffect, useState } from "react"
import { deletePost, getPosts, getPostsByGroupId, getPostsByUserId } from "../../services/postService"
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import PostPage from "./PostPage"
import CreatePost from "./CreatePost"
import { deleteFileFirebase } from "../../configs/firebaseSDK"
import DialogNotification from "../common/DialogNotification"
import { AuthContext } from "../../contexts/AuthContext"

const PostList = ({ posts, setPosts, group, userGroupContext, status, profile }) => {
    const { user } = useContext(AuthContext)
    const [headLoading, setHeadLoading] = useState(false)
    const [footLoading, setFootLoading] = useState(true)
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false)
    const [postToDelete, setPostToDelete] = useState(null)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [canCreate, setCanCreate] = useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
            let response = null
            if (group) response = await getPostsByGroupId(group.id, status)
            else if (profile){
                if (profile.id) response = await getPostsByUserId(profile.id)
                else response = []
            }
            else response = await getPosts()
            setPosts(response)
            setFootLoading(false)
        }
        fetchPosts()
        if (group) {
            setCanCreate(status !== "PENDING")
        }
        else if (profile) {
            setCanCreate(profile.relation === "myProfile")
        }
        else setCanCreate(!!user)
    }, [profile])

    const addPostToList = (newPost) => {
        setPosts([newPost, ...posts])
    }

    const editPostInList = (editedPost) => {
        setPosts(posts.map(p => p.id === editedPost.id ? editedPost : p))
    }

    const removePostFromList = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const closeDeleteSuccess = () => {
        setOpenDeleteSuccess(false)
    }

    const confirmDelete = async () => {
        setShowConfirmDelete(false)
        setHeadLoading(true)
        postToDelete.images.forEach(image => {
            deleteFileFirebase(image.filePath)
        })
        deletePost(postToDelete.id)
        removePostFromList(postToDelete)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setHeadLoading(false)
        setPostToDelete(null)
        setOpenDeleteSuccess(true)
    }

    const closeConfirmDelete = () => {
        setShowConfirmDelete(false)
        setPostToDelete(null)
    }

    useEffect(() => {
        const handleScroll = () => {
            const isScrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
            if (isScrolledToBottom) {
                // console.log('Đã cuộn hết trang!')
            }
        }
        window.onscroll = handleScroll
        return () => {
            window.onscroll = null
        }
    }, [])

    return (
        <Box sx={{ width: "600px" }}>
            {canCreate &&
                <CreatePost addPostToList={addPostToList} setHeadLoading={setHeadLoading} group={group}
                    userGroupContext={userGroupContext} />}

            {headLoading && <CircularProgress />}

            <Box>
                {posts.length === 0
                    && <Typography variant="h6" fontWeight="bold">Chưa có bài viết.</Typography>}

                {posts.length > 0 && posts.map((post, index) => (
                    <PostPage post={post} key={index} editPostInList={editPostInList}
                        userGroupContext={userGroupContext} removePostFromList={removePostFromList}
                        setShowConfirmDelete={setShowConfirmDelete} setPostToDelete={setPostToDelete} />
                ))}
                {footLoading &&
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                        <CircularProgress />
                    </Box>}
            </Box>

            <Dialog open={showConfirmDelete} onClose={closeConfirmDelete} maxWidth={false}
                sx={{ bottom: "150px" }}>
                <DialogTitle sx={{ borderBottom: '2px solid #ccc', display: 'flex', fontWeight: "bold" }}>
                    Thông báo
                </DialogTitle>
                <DialogContent sx={{ width: 500, fontSize: "18px" }}>
                    <p>Bạn có chắc muốn xóa bài viết này ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete} variant="contained">
                        Xác nhận
                    </Button>
                    <Button onClick={closeConfirmDelete} variant="outlined">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
            <DialogNotification open={openDeleteSuccess} onClose={closeDeleteSuccess}
                content="Bài viết đã được xóa thành công!" />
        </Box>
    )
}

export default PostList
