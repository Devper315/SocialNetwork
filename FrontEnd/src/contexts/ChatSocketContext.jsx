import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from './AuthContext'
import { Stomp } from '@stomp/stompjs';
import { CONFIG } from '../configs/config';
import ChatWindow from '../components/message/ChatWindow';
import { fetchConversationById, fetchPrivateConversation, fetchUnreadTotal } from '../services/conversationService';


export const ChatSocketContext = createContext()

export const ChatSocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const CHAT_ENDPOINT = '/app/private/send'
    const MARK_AS_READ = '/app/mark-as-read'
    let stompClientRef = useRef(null);
    const [conversations, setConversations] = useState([])
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [openingConversation, setOpeningConversation] = useState(null)
    const [messageList, setMessageList] = useState([])
    const [unreadTotal, setUnreadTotal] = useState(0)


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

    const onConnectSuccess = frame => {
        const chatTopic = `/user/${user.username}/private/reply`;
        stompClientRef.current.subscribe(chatTopic, message => {
            if (message.body) {
                const newMessage = JSON.parse(message.body)
                updateConversations(newMessage)
            }
        })
        fetchUnreadTotal().then(data => {
            setUnreadTotal(data)
        })
    }

    const updateConversations = async (newMessage) => {
        newMessage.isRead = false
        setOpeningConversation(prevConversation => {
            if (prevConversation && prevConversation.id === newMessage.conversationId) {
                setMessageList(prevMessages => [...prevMessages, newMessage])
                newMessage.isRead = true
                newMessage.reader = prevConversation.sender
                markMessageAsRead(newMessage)
            }
            return prevConversation
        })
        let updateConversation = newMessage.conversation
        console.log('updateConversation', updateConversation)
        if (updateConversation.read && !newMessage.isRead) setUnreadTotal(prev => prev + 1)
        updateConversation.read = newMessage.isRead
        setConversations(prevConversations =>
            [updateConversation, ...prevConversations.filter(c => c.id !== updateConversation.id)])
    }

    const onConnectError = (error) => {
        console.error('WebSocket connection error:', error);
    };

    const sendMessageWebSocket = (message) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(CHAT_ENDPOINT, {}, JSON.stringify(message));
        } else {
            console.error('Lỗi: chat socket chưa được thiết lập.');
        }
    }

    const markMessageAsRead = (newMessage) => {
        stompClientRef.current.send(MARK_AS_READ, {}, JSON.stringify(newMessage));
    }

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
        if (!conversation.read) {
            conversation.read = true
            setUnreadTotal(unreadTotal - 1)
        }
        setConversations(conversations.map(c => c.id !== conversation.id ? c : conversation))
    }

    const openChatByFriend = async (friend) => {
        let conversation = conversations.find(c => c.recipient === friend.username)
        if (!conversation)
            conversation = await fetchPrivateConversation(friend.id)
        openChatByConversation(conversation)
    }

    const handleCloseChatWindow = () => {
        setIsChatOpen(false)
        setOpeningConversation(null)
    }


    const PROVIDER_VALUE = {
        sendMessageWebSocket, conversations, setConversations,
        openChatByFriend, openChatByConversation, unreadTotal, setUnreadTotal
    }

    return (
        <ChatSocketContext.Provider value={PROVIDER_VALUE}>
            {children}
            {isChatOpen && <ChatWindow
                conversation={openingConversation} onClose={handleCloseChatWindow}
                markMessageAsRead={markMessageAsRead}
                messageList={messageList} setMessageList={setMessageList} />}
        </ChatSocketContext.Provider>
    )
}

