import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import FriendTab from './FriendTab'
import RequestTab from './RequestTab'
import SearchTab from './SearchTab'

const FriendList = () => {
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (_, tab) => {
        setActiveTab(tab)
    }

    return (
        <>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" >
                <Tab label="Danh sách bạn bè" sx={{ fontWeight: "bold", textTransform: 'none' }}/>
                <Tab label="Lời mời kết bạn" sx={{ fontWeight: "bold", textTransform: 'none' }}/>
                <Tab label="Tìm kiếm bạn bè" sx={{ fontWeight: "bold", textTransform: 'none' }}/>
            </Tabs>
            <Box sx={{ marginY: 2}}>
                {activeTab === 0 && <FriendTab />}
                {activeTab === 1 && <RequestTab />}
                {activeTab === 2 && <SearchTab />}
            </Box>
        </>
    )
}

export default FriendList
