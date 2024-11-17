import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from './AuthContext'
import { Stomp } from '@stomp/stompjs';
import { CONFIG } from '../configs/config';
import ChatWindow from '../components/user/message/ChatWindow';
import { fetchPrivateConversation } from '../services/conversationService';


export const ChatSocketContext = createContext()

export const ChatSocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const CHAT_ENDPOINT = '/app/private/send'
    let stompClientRef = useRef(null);
    let subscribedChatTopicRef = useRef(false)
    const [conversations, setConversations] = useState([])
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [openingConversation, setOpeningConversation] = useState({})

    useEffect(() => {
        if (user.username) {
            connectChatSocket()
        }
        return () => {
            disconnectChatSocket()
        }
    }, [user])

    const connectChatSocket = () => {
        const token = localStorage.getItem("token")
        const socket = new WebSocket(`${CONFIG.BASE_URL}/ws?token=${token}`);
        stompClientRef.current = Stomp.over(socket);
        const headers = {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
        };
        stompClientRef.current.connect(headers, onConnectSuccess, onConnectError);
    };

    const subscribeToChat = (handleMessageReceived, username) => {
        if (!subscribedChatTopicRef.current) {
            const chatTopic = `/user/${username}/private/reply`;
            stompClientRef.current.subscribe(chatTopic, message => {
                if (message.body) {
                    handleMessageReceived(JSON.parse(message.body));
                }
            });
            subscribedChatTopicRef.current = true
        }
    };

    const onConnectSuccess = frame => {
        console.log('Connected: ' + frame);
    };

    const onConnectError = (error) => {
        console.error('WebSocket connection error:', error);
    };

    const sendMessageWebSocket = (message) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(CHAT_ENDPOINT, {}, JSON.stringify(message));
        } else {
            console.error('Lỗi: chat socket chưa được thiết lập.');
        }
    };

    const disconnectChatSocket = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {
                console.log('Ngắt kết nối chat socket');
            });
        }
    };

    const openChatByConversation = (conversation) => {
        setIsChatOpen(true)
        setOpeningConversation(conversation)
    }

    const openChatByFriend = async (friend) => {
        let conversation = conversations.find(c => c.recipient === friend.username)
        if (!conversation) 
            conversation = await fetchPrivateConversation(friend.id)
        openChatByConversation(conversation)
    }

    const PROVIDER_VALUE = { subscribeToChat, sendMessageWebSocket, 
        conversations, setConversations, openChatByFriend, openChatByConversation }

    return (
        <ChatSocketContext.Provider value={PROVIDER_VALUE}>
            {children}
            {isChatOpen && <ChatWindow
                conversation={openingConversation}
                onClose={() => setIsChatOpen(false)} />}
        </ChatSocketContext.Provider>
    )
}

