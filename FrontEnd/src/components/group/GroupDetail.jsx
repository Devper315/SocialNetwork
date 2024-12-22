import React, { useContext, useEffect, useState } from 'react'
import { Typography, Avatar, Box, Tabs, Tab, CardMedia, CircularProgress, Button, Badge } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createGroupRequest, fetchGroupById, fetchUserGroupContext } from '../../services/groupService'
import ZoomImage from '../common/ZoomImage'
import PostList from "../post/PostList"
import { CheckCircle, GroupAdd } from '@mui/icons-material'
import GroupMember from './GroupMember'
import GroupRequest from './GroupRequest'
import GroupOption from './GroupOption'

const GroupDetail = () => {
    const { id } = useParams()
    const location = useLocation();
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState('')
    const [group, setGroup] = useState({})
    const [activeTabIndex, setActiveTabIndex] = useState(null)
    const [activeTab, setActiveTab] = useState()
    const [posts, setPosts] = useState([])
    const [pendingPosts, setPendingPosts] = useState([])
    const [userGroupContext, setUserGroupContext] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const tabStyle = {
        fontWeight: "bold", textTransform: 'none',
    }

    const handleTabIndexChange = (_, newIndex) => {
        setActiveTabIndex(newIndex)
    }

    const handleTabChange = (newTab) => {
        setActiveTab(newTab)
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tabIndex = {
            discuss: 0, pending: 2, request: 3
        }
        let tab = "discuss"
        if (params.size > 0) {
            tab = params.get("tab")
        }
        setActiveTab(tab)
        setActiveTabIndex(tabIndex[tab])
    }, [location.search])

    useEffect(() => {
        const getGroup = async () => {
            const groupData = await fetchGroupById(id)
            console.log(groupData)
            const userGroupContextData = await fetchUserGroupContext(id)
            userGroupContextData.toRequest = !userGroupContextData.joined && !userGroupContextData.requestSent
            setGroup(groupData)
            setUserGroupContext(userGroupContextData)
            window.scrollTo(0, 0)
            setIsLoading(false)
        }
        getGroup()
    }, [])

    useEffect(() => {
        setGroup({ 
            ...group, 
            totalPending: pendingPosts.filter(p => !p.approvalAction).length })
    }, [pendingPosts])



    const handleZoom = (url) => {
        setSelectedUrl(url)
        setZoom(true)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }

    const handleSendGroupRequest = () => {
        if (userGroupContext.toRequest) {
            createGroupRequest(id)
            setUserGroupContext({ ...userGroupContext, requestSent: true, toRequest: false })
        }
    }


    const pendingLabel =
        <>
            Bài viết đang chờ
            <Badge badgeContent={group.totalPending} color="error" overlap="circular"
                sx={{
                    position: "absolute", right: 10, top: 12,
                }}>
            </Badge>
        </>

    const requestLabel =
        <>
            Yêu cầu tham gia
            <Badge badgeContent={group.totalRequest} color="error" overlap="circular"
                sx={{
                    position: "absolute", right: 10, top: 12,
                }}>
            </Badge>
        </>


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
                        <Tab label="Thảo luận" sx={{ ...tabStyle, padding: '0 8px 0 8px' }}
                            onClick={() => handleTabChange("discuss")} />

                        <Tab label="Thành viên" sx={tabStyle} onClick={() => handleTabChange("member")} />

                        {(userGroupContext.owner || userGroupContext.approver) &&
                            <Tab label={pendingLabel} sx={{ ...tabStyle, pr: group.totalPending > 0 ? 3 : 2 }}
                                onClick={() => handleTabChange("pending")} />}

                        {userGroupContext.owner &&
                            <Tab label={requestLabel} sx={{ ...tabStyle, pr: group.totalRequest > 0 ? 3 : 2 }}
                                onClick={() => handleTabChange("request")} />}

                        <Tab label="Tùy chọn" sx={tabStyle} onClick={() => handleTabChange("option")} />
                    </Tabs>
                    <Box sx={{
                        border: "1px solid #d3d3d3", borderRadius: 5, p: 2, width: "632px", minHeight: "250px"
                    }}>
                        {activeTab === "discuss" &&
                            <PostList posts={posts} setPosts={setPosts} status="APPROVED"
                                group={group} userGroupContext={userGroupContext} />}
                        {activeTab === "member" &&
                            <GroupMember group={group} setGroup={setGroup} userGroupContext={userGroupContext}
                                setUserGroupContext={setUserGroupContext} />}
                        {activeTab === "request" && <GroupRequest group={group} setGroup={setGroup}
                        />}
                        {activeTab === "pending" &&
                            <PostList posts={pendingPosts} setPosts={setPendingPosts} group={group} status="PENDING" />}
                        {activeTab === "option" &&
                            <GroupOption group={group} setGroup={setGroup} userGroupContext={userGroupContext} />
                        }
                    </Box>
                </>}
        </Box >

    )
}

export default GroupDetail