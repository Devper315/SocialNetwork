import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatSocketContext } from '../../contexts/ChatSocketContext';
import { Tabs, Tab, Box, Pagination } from '@mui/material';
import FriendTab from './FriendTab';
import RequestTab from './RequestTab';
import SearchTab from './SearchTab';
import { fetchFriend, fetchFriendRequest, searchFriend, actionFriendRequestById } from '../../services/friendService';

const FriendList = () => {
    const { openChatByFriend } = useContext(ChatSocketContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 0);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: null });
    const [keyword, setKeyword] = useState(location.state?.keyword || '');

    const fetchData = async () => {
        if (activeTab === 0) {
            const data = await fetchFriend(pagination.page);
            setFriends(data.result || []);
            setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
        } else if (activeTab === 1) {
            const data = await fetchFriendRequest(pagination.page);
            setRequests(data.result || []);
            setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
        } else if (activeTab === 2 && keyword.trim()) {
            const data = await searchFriend(keyword, pagination.page);
            setSearchResults(data.result || []);
            setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, pagination.page]);

    const handleSearch = () => {
        fetchData();
    };

    const updateFriendRequest = (requestId, accept) => {
        actionFriendRequestById(requestId, accept);
        setRequests((prev) =>
            prev.map((item) => (item.id === requestId ? { ...item, status: accept ? 'Đã chấp nhận' : 'Đã từ chối' } : item))
        );
    };

    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
        navigate(location.pathname, { state: { activeTab: newValue } });
    };

    return (
        <Box sx={{
            position: "relative", left: "25%", display: 'flex',
            flexDirection: 'column', padding: 2, maxWidth: "50%",
        }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Danh sách bạn bè" />
                <Tab label="Lời mời kết bạn" />
                <Tab label="Tìm kiếm bạn bè" />
            </Tabs>
            <Box sx={{ marginY: 2 }}>
                {activeTab === 0 && <FriendTab friends={friends} openChatByFriend={openChatByFriend} />}
                {activeTab === 1 && <RequestTab requests={requests} updateFriendRequest={updateFriendRequest} />}
                {activeTab === 2 && (
                    <SearchTab keyword={keyword} setKeyword={setKeyword} searchResults={searchResults} handleSearch={handleSearch} />
                )}
            </Box>
            {pagination.totalPages > 1 && (
                <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={(_, page) => setPagination((prev) => ({ ...prev, page }))}
                    color="primary"
                    sx={{ marginTop: 2 }}
                />
            )}
        </Box>
    );
};

export default FriendList;
