import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createFriendRequest, actionFriendRequestByUserId, unfriend } from "../../services/friendService"
import { fetchProfileById, updateMyProfile } from '../../services/profileService'
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Paper, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import ZoomImage from '../common/ZoomImage'
import PostList from '../post/PostList'
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState({})
    const [editing, setEditing] = useState(false)
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(null)
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const [myPosts, setMyPosts] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        const getProfile = async () => {
            const profileData = await fetchProfileById(id)
            setProfile(profileData)
        }
        getProfile()
    }, [id])

    const handleTabIndexChange = (_, newIndex) => {
        setActiveTabIndex(newIndex)
    }

    const sendFriendRequest = () => {
        createFriendRequest(profile.id)
        setProfile({ ...profile, sentRequest: true, toSendRequest: false })
    }

    const updateFriendRequest = (accept) => {
        setProfile({
            ...profile,
            friend: accept,
            hasRequest: false,
            sentRequest: false,
            toSendRequest: !accept
        })
        actionFriendRequestByUserId(profile.id, accept)
    }

    const handleUnfriend = () => {
        unfriend(profile.id)
        setProfile({ ...profile, friend: false, toSendRequest: true })
    }


    const updateProfile = async (updatedData) => {
        await updateMyProfile(updatedData)
        setProfile(updatedData)
    }

    const handleZoom = (imageUrl) => {
        setSelectedUrl(imageUrl)
        setZoom(true)
    }

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }

    const tabStyle = {
        fontWeight: "bold", textTransform: 'none',
    }

    const buttonStyle = {
        borderRadius: "10px",
        textTransform: "none",
        height: "30px",
        fontWeight: "bold",
        borderWidth: 1,
        padding: 0
    }

    const buttons = {
        friend: {
            color: "0288d1",
            content: "Bạn bè"
        }
    }

    return (
        <Box sx={{ ml: "27%", width: "632px" }}>
            <Paper elevation={3} sx={{ p: "32px 0 16px 32px", borderRadius: 3, }}>
                <Stack direction="column" spacing={2}>
                    <Avatar src={profile.avatarUrl} alt="Avatar" sx={{ width: 120, height: 120, mb: 2, cursor: "pointer" }}
                        onClick={() => handleZoom(profile.avatarUrl)} />
                    <ZoomImage open={zoom} onClose={handleCloseZoom} imageSrc={profile.avatarUrl} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', width: "fit-content" }}>
                        {profile.fullName}
                    </Typography>
                    {profile.id &&!profile.myProfile &&
                        <Stack direction="row">
                            <Stack direction="row" spacing={1} alignItems="center"
                                sx={{
                                    backgroundColor: "#f0f0f0", p: "4px 16px", boxShadow: 2, borderRadius: "8px",
                                    width: "fit-content", color: "#0288d1"
                                }} >
                                <PeopleIcon />
                                <Typography>Bạn bè</Typography>
                            </Stack>

                            <Tooltip title="Tùy chọn">
                                <IconButton onClick={handleOpenMenu}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>

                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                    sx: {
                                        border: "1px solid #ddd", borderRadius: '8px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    }
                                }}>
                                <MenuItem sx={{ padding: "0 10px 0px 10px" }}>
                                    <Button onClick={handleUnfriend} color='inherit'
                                        sx={buttonStyle}>
                                        Hủy kết bạn
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </Stack>}
                </Stack>
            </Paper>

            <Paper elevation={3} sx={{ p: "10px 30px", borderRadius: 3, mt: 2 }}>
                <Tabs value={activeTabIndex} onChange={handleTabIndexChange} sx={{ mb: 2 }}>
                    <Tab label="Bài viết" sx={tabStyle} />
                    <Tab label="Thông tin cá nhân" sx={tabStyle} />
                </Tabs>
                {activeTabIndex === 0 &&
                    <PostList posts={myPosts} setPosts={setMyPosts} />}
                {activeTabIndex === 1 &&
                    <Box sx={{ width: "632px" }}></Box>}
            </Paper>
        </Box>

    )
}

export default Profile
