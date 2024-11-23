import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, IconButton, TextField, Typography, Avatar } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageStatusTranslation } from '../../translations/MessageStatusTranslation';
import { format } from 'date-fns';
import { ChatSocketContext } from '../../contexts/ChatSocketContext';
import { VideoCallSocketContext } from '../../contexts/VideoCallSocketContext';
import { fetchMessagesByConversationId } from '../../services/conversationService';
import { handleScrollReverse } from '../../services/infiniteScroll';
import SendIcon from '@mui/icons-material/Send';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import '../../assets/styles/message/ChatWindow.css';


const ChatWindow = ({ conversation, onClose, messageList, setMessageList, markMessageAsRead }) => {
    const { user } = useContext(AuthContext);
    const { sendMessageWebSocket } = useContext(ChatSocketContext);
    const { startCall } = useContext(VideoCallSocketContext);
    const [message, setMessage] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const chatBodyRef = useRef(null);
    const [lastId, setLastId] = useState(0);

    useEffect(() => {
        const loadFirstMessageList = async () => {
            const data = await fetchMessagesByConversationId(conversation.id, 0);
            setHasMore(data.length === 10);
            setMessageList(data);
            if (data.length === 10) {
                setLastId(data.at(0).id);
                setIsAtBottom(true);
            }
            if (data.length > 0 && !data.at(-1).isRead) {
                let lastMessage = data.at(-1);
                lastMessage.reader = conversation.sender;
                markMessageAsRead(lastMessage);
            }
        };
        loadFirstMessageList();
    }, [conversation]);

    const loadMoreMessages = async () => {
        if (!hasMore) return;
        const data = await fetchMessagesByConversationId(conversation.id, lastId);
        setHasMore(data.length === 10);
        setMessageList([...data, ...messageList]);
        if (data.length === 10) {
            setLastId(data.at(0).id);
            chatBodyRef.current.scrollTop += 50;
        }
    };

    useEffect(() => {
        const chatBody = chatBodyRef.current;
        if (chatBody && isAtBottom) {
            chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight;
        }
    }, [messageList]);

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
                time: format(new Date(), 'HH:mm dd/MM/yyyy'),
            };
            sendMessageWebSocket(newMessage);
            setMessageList([...messageList, newMessage]);
            setMessage('');
        }
    };

    const handleStartCall = () => {
        startCall(conversation.recipient);
    };

    const scrollReverse = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        setIsAtBottom(scrollTop === scrollHeight - clientHeight);
        handleScrollReverse(event, loadMoreMessages);
    };

    return (
        <Box className="chat-window">
            <Box className="chat-header">
                <Typography variant="h6" className="recipient-name">{conversation.name}</Typography>
                <IconButton onClick={handleStartCall} className="call-button">
                    <VideocamIcon className="call-icon-video" />
                </IconButton>
                <IconButton onClick={handleStartCall} className="call-button">
                    <CallIcon className="call-icon" />
                </IconButton>
                <IconButton onClick={onClose} className="close-button">
                    <Typography variant="h5">×</Typography>
                </IconButton>
            </Box>
            <Box
                className="chat-body"
                ref={chatBodyRef}
                onScroll={scrollReverse}
                sx={{
                    flex: 1,
                    padding: 2,
                    overflowY: 'auto',
                    maxHeight: 'calc(100% - 140px)',
                }}>
                {messageList.map((msg, index) => (
                    <Box
                        className={`message ${msg.sender === user.username ? 'sent' : 'received'}`}
                        key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: msg.sender === user.username ? 'row-reverse' : 'row'}}>
                        <Box
                            className="message-content"
                            sx={{
                                backgroundColor: msg.sender === user.username ? '#cac6c6' : '#007bff',
                                color: msg.sender === user.username ? '#000' : '#fff',
                                borderRadius: 2,
                                maxWidth: '100%'
                            }}>
                            {msg.content}
                        </Box>
                        <Typography variant="caption" className="message-time">
                            {msg.time ? msg.time : MessageStatusTranslation[msg.status]}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box className="chat-footer" sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Aa"
                    fullWidth
                    multiline
                    rows={1} variant="outlined"
                    sx={{
                        marginRight: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 5,
                            fontSize: 14,
                        },
                    }}
                    onKeyDown={handleKeyDown}
                />
                <IconButton onClick={handleSend} className="send-button">
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;
