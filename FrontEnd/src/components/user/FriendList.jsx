import React, { useContext, useEffect, useState } from 'react';
import "../../assets/styles/user/FriendList.css"
import { actionFriendRequestById, fetchFriend, fetchFriendRequest, searchFriend } from '../../services/friendService';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { ChatSocketContext } from '../../contexts/ChatSocketContext';

const FriendList = () => {
    const tabs = {
        friends: "Danh sách bạn bè",
        requests: "Lời mời kết bạn",
        search: "Tìm kiếm bạn bè"
    }
    const {openChatByFriend} = useContext(ChatSocketContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [keyword, setKeyword] = useState(
        location.state?.keyword || ''
    );
    const [activeTab, setActiveTab] = useState(
        location.state?.activeTab || 'friends'
    );
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
            console.log(data.result)
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

    useEffect(() => {
        fetchData(activeTab, pagination.page)
    }, [activeTab, pagination.page])
    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = () => {
        fetchData(activeTab, pagination.page)
        navigate(location.pathname, {
            state: {activeTab, keyword, pagination}
        })
    };
    

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

    const updateFriendRequest = (requestId, accept) => {
        actionFriendRequestById(requestId, accept)
        setRequests(
            requests.map(item =>
                item.id === requestId
                    ? { ...item, status: accept ? 'Đã chấp nhận' : 'Đã từ chối' }
                    : item)
        );
    }
    const renderTabContent = () => {
        if (activeTab === 'friends')
            return (
                <div>
                    <h3>Danh sách bạn bè</h3>
                    <ul>
                        {friends.length > 0 && friends.map(friend => (
                            <li key={friend.id}>
                                <Link to={`/profile/${friend.id}`}>{friend.fullName}</Link>
                                <button onClick={() => openChatByFriend(friend)}>Nhắn tin</button>
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
                        {requests.map(item => (
                            <div key={item.id}>
                                <li>{item.requestor.fullName}</li>
                                {item.status ? (
                                    <p>{item.status}</p>
                                ) : (
                                    <>
                                        <button onClick={() => updateFriendRequest(item.id, true)}>
                                            Chấp nhận kết bạn
                                        </button>
                                        <button onClick={() => updateFriendRequest(item.id, false)}>
                                            Xóa yêu cầu kết bạn
                                        </button>
                                    </>
                                )}
                            </div>
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
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(location.pathname, {
            state: { activeTab: tab, keyword, pagination }
        });
    };
    
    return (
        <div className="friend-list-container">
            <div className="sidebar">
                <h3>Danh sách</h3>
                <ul>
                    {Object.keys(tabs).map(key => (
                        <li key={key}
                            className={activeTab === key ? 'active' : ''}
                            onClick={() => handleTabChange(key)}>
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
            
        </div>
    );
};





export default FriendList;
