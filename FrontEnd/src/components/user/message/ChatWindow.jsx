import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/styles/user/message/ChatWindow.css';
import iconSend from '../../../assets/images/iconSend.png'
import iconCall from "../../../assets/images/iconCall.png"
import { AuthContext } from '../../../contexts/AuthContext';
import { MessageStatusTranslation } from '../../../translations/MessageStatusTranslation';
import { format } from 'date-fns';
import { ChatSocketContext } from '../../../contexts/ChatSocketContext';
import { VideoCallSocketContext } from '../../../contexts/VideoCallSocketContext';
import { fetchMessagesByConversationId } from '../../../services/conversationService';
import { handleScrollReverse } from '../../../services/infiniteScroll';


const ChatWindow = ({ conversation, onClose, messageList, setMessageList, markMessageAsRead}) => {
    const { user } = useContext(AuthContext)
    const { sendMessageWebSocket } = useContext(ChatSocketContext)
    const { startCall } = useContext(VideoCallSocketContext)
    const [message, setMessage] = useState('')
    const [hasMore, setHasMore] = useState(true)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const chatBodyRef = useRef(null)
    const [lastId, setLastId] = useState(0)


    useEffect(() => {
        const loadFirstMessageList = async () => {
            console.log(conversation)
            const data = await fetchMessagesByConversationId(conversation.id, 0);
            setHasMore(data.length === 10)
            setMessageList(data);
            if (data.length === 10) {
                setLastId(data.at(0).id)
                setIsAtBottom(true)
            }
            if (data.length > 0 && !data.at(-1).isRead) {
                let lastMessage = data.at(-1)
                lastMessage.reader = conversation.sender
                markMessageAsRead(lastMessage)
            }
                
        }
        loadFirstMessageList()
    }, [conversation])


    const loadMoreMessages = async () => {
        if (!hasMore) return
        const data = await fetchMessagesByConversationId(conversation.id, lastId);
        setHasMore(data.length === 10)
        setMessageList([...data, ...messageList]);
        if (data.length === 10) {
            setLastId(data.at(0).id)
            chatBodyRef.current.scrollTop += 50
        }
    };

    useEffect(() => {
        const chatBody = chatBodyRef.current
        if (chatBody && isAtBottom) {
            chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight
        }
    }, [messageList])


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleSend = () => {
        if (message) {
            const newMessage = {
                conversationId: conversation.id,
                sender: conversation.sender,
                recipient: conversation.recipient,
                content: message,
                status: 'sending',
                time: format(new Date(), 'HH:mm dd/MM/yyyy')
            }
            sendMessageWebSocket(newMessage)
            setMessageList([...messageList, newMessage])
            setMessage('')
        }
    }

    const handleStartCall = () => {
        startCall(conversation.recipient)
    }

    const scrollReverse = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        setIsAtBottom(scrollTop === scrollHeight - clientHeight)
        handleScrollReverse(event, loadMoreMessages)
    }
    return (
        <div className="chat-window">
            <div className="chat-header">
                <span className="recipient-name">{conversation.name}</span>
                <button className="send-button"
                    onClick={handleStartCall}>
                    <img src={iconCall} alt="Icon" className="call-icon" />
                </button>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="chat-body" ref={chatBodyRef} onScroll={(event) => scrollReverse(event)}>
                {messageList.map((msg, index) => (
                    <div className={`message ${msg.sender === user.username ? 'sent' : 'received'}`} key={index}>
                        <div className="message-content">
                            {msg.content}
                        </div>
                        <div className="message-time">
                            {msg.time ? msg.time : MessageStatusTranslation[msg.status]}
                        </div>
                    </div>
                ))}
            </div>
            <div className='chat-footer'>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Aa"
                    className="chat-input"
                    rows="1"
                    onKeyDown={handleKeyDown} />
                <button
                    className="send-button"
                    onClick={handleSend}>
                    <img src={iconSend} alt="Gửi" className="send-icon" />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;