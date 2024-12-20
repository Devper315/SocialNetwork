import React, { useContext, useEffect, useState } from 'react'
import { Typography, Avatar, Box, Tabs, Tab, CardMedia, CircularProgress, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { createGroupRequest, fetchGroupById, fetchGroupMembers, fetchUserGroupContext } from '../../services/groupService'
import ZoomImage from '../common/ZoomImage'
import PostList from "../post/PostList"
import { CheckCircle, GroupAdd } from '@mui/icons-material'
import EditIcon from "@mui/icons-material/Edit";
import GroupEditDialog from './GroupEditDialog'
import GroupMember from './GroupMember'
import GroupRequest from './GroupRequest'

const GroupDetail = () => {
    const { id } = useParams()
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState('')
    const [group, setGroup] = useState({})
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const [activeTab, setActiveTab] = useState('discuss')
    const [posts, setPosts] = useState([])
    const [userGroupContext, setUserGroupContext] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [members, setMembers] = useState([])

    const handleTabIndexChange = (_, newIndex) => {
        setActiveTabIndex(newIndex)
    }

    const handleTabChange = (newTab) => {
        setActiveTab(newTab)
    }

    useEffect(() => {
        const getGroup = async () => {
            const groupData = await fetchGroupById(id)
            const userGroupContextData = await fetchUserGroupContext(id)
            userGroupContextData.toRequest = !userGroupContextData.joined && !userGroupContextData.requestSent
            console.log(userGroupContextData)
            setGroup(groupData)
            setUserGroupContext(userGroupContextData)
            window.scrollTo(0, 0)
            setIsLoading(false)
        }
        getGroup()
    }, [])

    const handleZoom = (url) => {
        setSelectedUrl(url)
        setZoom(true)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }

    const loadGroupMember = async () => {
        handleTabChange("member")
        const memberData = await fetchGroupMembers(id)
        setMembers(memberData)

    }

    const handleSendGroupRequest = () => {
        if (userGroupContext.toRequest) {
            createGroupRequest(id)
            setUserGroupContext({ ...userGroupContext, requestSent: true, toRequest: false })
        }
    }

    return (
        <Box>
            <Box sx={{
                border: "1px solid #d3d3d3", borderRadius: 5, minHeight: "250px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
                {isLoading && <CircularProgress />}
                {!isLoading && <>
                    <CardMedia component="img" image={group.imageUrl}
                        onClick={() => handleZoom(group.imageUrl)}
                        sx={{
                            borderRadius: 5,
                            borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                            height: "300px", cursor: "pointer"
                        }} />
                    <ZoomImage open={zoom} onClose={handleCloseZoom} imageSrc={selectedUrl} />
                    <Box p={2} textAlign="left" marginRight="auto">
                        <Typography variant="h5" fontWeight={"700"} sx={{ color: 'info', mb: 2 }}>
                            {group.name}
                        </Typography>
                        <Typography variant='body1' color={!group.description ? "textDisabled" : ""}
                            sx={{ whiteSpace: "pre-line" }} >
                            {group.description || 'Nhóm chưa có thông tin mô tả'}
                        </Typography>

                        <Box sx={{
                            display: "inline-flex", backgroundColor: "#f0f0f0", p: 1,
                            borderRadius: '8px', boxShadow: 2, mt: 1, gap: 1,
                            cursor: userGroupContext.toRequest ? "pointer" : ""
                        }} onClick={handleSendGroupRequest}>
                            {userGroupContext.joined && <CheckCircle color='success' />}
                            {userGroupContext.toRequest && <GroupAdd />}
                            {userGroupContext.requestSent && <CheckCircle />}
                            <Typography>
                                {userGroupContext.joined && 'Đã tham gia'}
                                {userGroupContext.toRequest && 'Yêu cầu tham gia'}
                                {userGroupContext.requestSent && 'Đã gửi yêu cầu tham gia'}
                            </Typography>
                        </Box>
                    </Box>
                </>}
            </Box>

            {userGroupContext.joined &&
                <>
                    <Tabs value={activeTabIndex} onChange={handleTabIndexChange} sx={{ mb: 2 }}>
                        <Tab label="Thảo luận" sx={{ fontWeight: "bold", textTransform: 'none', padding: '0 8px 0 8px' }}
                            onClick={() => handleTabChange("discuss")} />
                        <Tab label="Thành viên" sx={{ fontWeight: "bold", textTransform: 'none' }}
                            onClick={loadGroupMember} />
                        {userGroupContext.owner &&
                            <Tab label="Yêu cầu tham gia" sx={{ fontWeight: "bold", textTransform: 'none' }}
                                onClick={() => handleTabChange("request")} />}
                        <Tab label="Tùy chọn" sx={{ fontWeight: "bold", textTransform: 'none' }}
                            onClick={() => handleTabChange("option")} />
                    </Tabs>
                    <Box sx={{
                        border: "1px solid #d3d3d3", borderRadius: 5, p: 2, width: "632px",
                        display: "flex", justifyContent: "left"
                    }}>
                        {activeTab === "discuss" && <PostList posts={posts} setPosts={setPosts} groupId={id} />}
                        {activeTab === "member" &&
                            <Box textAlign="left" height="500px">
                                <Typography fontWeight="bold" sx={{ mb: 1 }}>Danh sách thành viên</Typography>
                                {members.map(member =>
                                    <GroupMember group={group} member={member} userGroupContext={userGroupContext} />
                                )}
                            </Box>
                        }
                        {activeTab === "request" && <GroupRequest group={group}/>}
                        {activeTab === "option" &&
                            <>
                                <Button variant="outlined" sx={{ fontWeight: "bold", color: "#333333", borderRadius: 3 }}
                                    startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                                    Sửa thông tin nhóm
                                </Button>
                                <GroupEditDialog show={editing} handleClose={() => setEditing(false)}
                                    group={group} setGroup={setGroup} />
                            </>
                        }
                    </Box>
                </>}
        </Box >

    )
}

export default GroupDetail