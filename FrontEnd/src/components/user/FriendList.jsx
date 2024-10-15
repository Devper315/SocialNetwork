// src/components/FriendList.js
import React, { useEffect, useState } from 'react';
import "../../assets/styles/user/FriendList.css"
import { fetchFriend } from '../../services/friendService';
import { fetchPrivateConversation } from '../../services/conversationService';
import ChatWindow from './message/ChatWindow';

const FriendList = () => {
    const [activeTab, setActiveTab] = useState('friends');
    const tabs = {
        friends: "Danh sách bạn bè",
        requests: "Lời mời kết bạn",
        search: "Tìm kiếm bạn bè"
    }
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])
    const [conversation, setConversation] = useState({})
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [recipient, setRecipient] = useState({})
    useEffect(() => {
        const getFriend = async () => {
            const friendData = await fetchFriend()
            setFriends(friendData)
        }
        getFriend()
    }, [])
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const results = friends.filter(friend => friend.toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResults(results);
    };
    const openChatWindow = async (friendId) => {
        const conversationData = await fetchPrivateConversation(friendId)
        setConversation(conversationData)
        setIsChatOpen(true)
        const friend = friends.find(friend => friend.id === friendId)
        setRecipient(friend)
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
                {activeTab === 'search' ? (
                    <div className="search-container">
                        <h3>Tìm bạn</h3>
                        <input
                            type="text"
                            placeholder="Nhập tên bạn..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button onClick={handleSearch}>Tìm</button>
                        {searchResults.length > 0 && (
                            <div>
                                <h4>Danh sách tìm kiếm</h4>
                                <ul>
                                    {searchResults.map((result, index) => (
                                        <li key={index}>{result}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h3>{activeTab === 'friends' ? 'Danh sách bạn bè' : 'Lời mời kết bạn'}</h3>
                        <ul>
                            {activeTab === 'friends' && friends.map(friend => (
                                <li key={friend.id}>{friend.fullName} 
                                    <span> </span>
                                    <button onClick={() => openChatWindow(friend.id)}>Nhắn tin</button>
                                </li>
                            ))}
                            {activeTab === 'requests' && requests.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isChatOpen && <ChatWindow
                conversation={conversation}
                onClose={() => setIsChatOpen(false)}
                recipient={recipient}/>}
        </div>
    );
};

export default FriendList;
