import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/styles/user/message/ChatWindow.css';
import iconSend from '../../../assets/images/iconSend.png'
import iconCall from "../../../assets/images/iconCall.png"
import { AuthContext } from '../../../contexts/AuthContext';
import { MessageStatusTranslation } from '../../../translations/MessageStatusTranslation';
import { format } from 'date-fns';
import { ChatSocketContext } from '../../../contexts/ChatSocketContext';
import { VideoCallSocketContext } from '../../../contexts/VideoCallSocketContext';


const ChatWindow = ({ conversation, onClose, recipient }) => {
    const { user } = useContext(AuthContext)
    const { subscribeToChat, sendMessageWebSocket } = useContext(ChatSocketContext)
    const { startCall } = useContext(VideoCallSocketContext)
    const [messageList, setMessageList] = useState(conversation.messageList)
    const [message, setMessage] = useState('')
    const chatBodyRef = useRef(null)

    useEffect(() => {
        console.log(recipient)
        const handleMessageReceived = (newMessage) => {
            setMessageList(prevMessages => [...prevMessages, newMessage])
        }
        subscribeToChat(handleMessageReceived, user.username)
        const chatBody = chatBodyRef.current
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight
        }
    }, [])

    useEffect(() => {
        const chatBody = chatBodyRef.current
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight
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
        startCall(recipient.username)
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h4 className="recipient-name">{recipient.fullName}</h4>
                <button className="send-button"
                    onClick={handleStartCall}>
                    <img src={iconCall} alt="Icon" className="call-icon" />
                </button>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
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