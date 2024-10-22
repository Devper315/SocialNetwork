import React, { useEffect, useState } from 'react';
import "../../assets/styles/user/FriendList.css"
import { fetchFriend, fetchFriendRequest, searchFriend } from '../../services/friendService';
import { fetchPrivateConversation } from '../../services/conversationService';
import ChatWindow from './message/ChatWindow';
import { Link } from 'react-router-dom';

const FriendList = () => {
    const [activeTab, setActiveTab] = useState('friends');
    const tabs = {
        friends: "Danh sách bạn bè",
        requests: "Lời mời kết bạn",
        search: "Tìm kiếm bạn bè"
    }
    const [keyword, setKeyword] = useState('');
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])
    const [searchResults, setSearchResults] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 20,
        totalPages: null
    });
    const fetchData = async (tab, page) => {
        let data;
        if (tab === 'friends') {
            data = await fetchFriend(page);
            setFriends(data.result || []);
        }
        else if (tab === 'requests') {
            data = await fetchFriendRequest(page);
            setRequests(data.result || []);
        }
        else {
            data = await searchFriend(keyword, page);
            setSearchResults(data.result);
        }
        setPagination(prev => ({
            ...prev,
            totalPages: data.totalPages > 0 ? data.totalPages : null,
            page: page
        }));
    };
    const [conversation, setConversation] = useState({})
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [recipient, setRecipient] = useState({})
    useEffect(() => {
        fetchData(activeTab, pagination.page)
    }, [activeTab, pagination.page])
    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = () => {
        fetchData(activeTab, pagination.page)
    };
    const openChatWindow = async (friendId) => {
        const conversationData = await fetchPrivateConversation(friendId)
        setConversation(conversationData)
        setIsChatOpen(true)
        const friend = friends.find(friend => friend.id === friendId)
        setRecipient(friend)
    }

    const goToPreviousPage = () => {
        setPagination({
            ...pagination,
            page: pagination.page - 1
        })
    }

    const goToNextPage = () => {
        setPagination({
            ...pagination,
            page: pagination.page + 1
        })
    }
    const renderTabContent = () => {
        if (activeTab === 'friends')
            return (
                <div>
                    <h3>Danh sách bạn bè</h3>
                    <ul>
                        {friends.length > 0 && friends.map(friend => (
                            <li key={friend.id}>{friend.fullName}
                                <button onClick={() => openChatWindow(friend.id)}>Nhắn tin</button>
                            </li>
                        ))}
                        {friends.length === 0 &&
                            <h4>Chưa có bạn bè</h4>
                        }
                    </ul>
                </div>
            );
        if (activeTab === 'requests')
            return (
                <div>
                    <h3>Lời mời kết bạn</h3>
                    <ul>
                        {requests.map((item, index) => (
                            <li key={index}>{item.requestor.fullName}</li>
                        ))}
                        {requests.length === 0 &&
                            <h4>Không có lời mời kết bạn nào</h4>
                        }
                    </ul>
                </div>
            );
        if (activeTab === 'search')
            return (
                <div className="search-container">
                    <h3>Tìm bạn</h3>
                    <input
                        type="text"
                        placeholder="Nhập tên bạn..."
                        value={keyword}
                        onChange={handleSearchChange} />
                    <button onClick={handleSearch}>Tìm</button>
                    {searchResults.length > 0 ? (
                        <div>
                            <h4>Danh sách tìm kiếm</h4>
                            <ul>
                                {searchResults.map(result => (
                                    <div key={result.id}>
                                        <h5 >
                                            <Link to={`/profile/${result.id}`}> {result.fullName}</Link> 
                                        </h5>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <h4>Không có kết quả</h4>
                        </div>
                    )}
                </div>
            );
    }
    return (
        <div className="friend-list-container">
            <div className="sidebar">
                <h3>Danh sách</h3>
                <ul>
                    {Object.keys(tabs).map(key => (
                        <li key={key}
                            className={activeTab === key ? 'active' : ''}
                            onClick={() => setActiveTab(key)}>
                            {tabs[key]}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="content">
                {renderTabContent()}
                {pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={goToPreviousPage} disabled={pagination.page === 1}>
                            Trang trước
                        </button>
                        <span>Trang {pagination.page} / {pagination.totalPages}</span>
                        <button onClick={goToNextPage} disabled={pagination.page === pagination.totalPages}>
                            Trang sau
                        </button>
                    </div>
                )}
            </div>
            {isChatOpen && <ChatWindow
                conversation={conversation}
                onClose={() => setIsChatOpen(false)}
                recipient={recipient} />}
        </div>
    );
};





export default FriendList;
