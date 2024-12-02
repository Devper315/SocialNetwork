import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageStatusTranslation } from '../../translations/MessageStatusTranslation';
import { format } from 'date-fns';
import { ChatSocketContext } from '../../contexts/ChatSocketContext';
import { VideoCallSocketContext } from '../../contexts/VideoCallSocketContext';
import { createMessage, fetchMessagesByConversationId, updateMessageImage } from '../../services/conversationService';
import { handleScrollReverse } from '../../services/infiniteScroll';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';
import '../../assets/styles/message/ChatWindow.css';
import TextInput from '../common/TextInput';
import { uploadFileToFirebase } from '../../configs/firebaseSDK';
import ImageGallery from '../common/ImageGallery';


const ChatWindow = ({ conversation, onClose, messageList, setMessageList, markMessageAsRead }) => {
    const { user } = useContext(AuthContext);
    const { sendMessageWebSocket } = useContext(ChatSocketContext);
    const { startVideoCall, startAudioCall } = useContext(VideoCallSocketContext);
    const [hasMore, setHasMore] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const chatBodyRef = useRef(null);
    const [lastId, setLastId] = useState(0);

    useEffect(() => {
        const loadFirstMessageList = async () => {
            const data = await fetchMessagesByConversationId(conversation.id, 0);
            console.log(data)
            setHasMore(data.length === 10);
            setMessageList(data);
            if (data.length === 10) {
                setLastId(data.at(0).id);
                setIsAtBottom(true);
            }
            console.log(data.at(-1))
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

    const handleSend = async (message, messageImages) => {
        if (!message && messageImages.length === 0) return
        let newMessage = {
            conversationId: conversation.id,
            sender: conversation.sender,
            recipient: conversation.recipient,
            content: message,
            status: 'sending',
            imageUrls: [],
            time: format(new Date(), 'HH:mm dd/MM/yyyy'),
        }
        newMessage = await createMessage(newMessage)
        if (messageImages.length > 0) {
            const uploadPromises = messageImages.map((image, index) => {
                const filename = `message/${newMessage.id}-${index}`
                return uploadFileToFirebase(image, filename);
            })
            const imageUrls = await Promise.all(uploadPromises)
            console.log(imageUrls)
            newMessage.imageUrls = imageUrls
            updateMessageImage(newMessage)
        }
        setMessageList([...messageList, newMessage])
        sendMessageWebSocket(newMessage);
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
                <IconButton onClick={() => startVideoCall({
                    username: conversation.recipient,
                    fullName: conversation.name
                })}
                    className="header-button">
                    <VideocamIcon />
                </IconButton>
                <IconButton onClick={() => startAudioCall({
                    username: conversation.recipient,
                    fullName: conversation.name
                })}
                    className="header-button">
                    <CallIcon />
                </IconButton>
                <IconButton onClick={onClose} className="header-button">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box
                className="chat-body"
                ref={chatBodyRef}
                onScroll={scrollReverse}>

                {messageList.map((msg, index) => (
                    <>
                        {msg.content !== '' &&
                            <Box className={`message ${msg.sender === user.username ? 'sent' : 'received'}`}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: msg.sender === user.username ? 'row-reverse' : 'row'
                                }}>
                                <Box className="message-content"
                                    sx={{
                                        fontSize: "14px", borderRadius: 3, maxWidth: '100%',
                                        backgroundColor: msg.sender === user.username ? '#cac6c6' : '#007bff',
                                        color: msg.sender === user.username ? '#000' : '#fff'
                                    }}>
                                    {msg.content.split("\n").map((str, i) => <><span key={i}>{str}</span><br /></>)}
                                </Box>
                                <Typography variant="caption" className="message-time">
                                    {msg.time ? msg.time : MessageStatusTranslation[msg.status]}
                                </Typography>
                            </Box>}
                        <ImageGallery msg={msg} />
                    </>
                ))}
            </Box>
            <TextInput handleSubmit={handleSend} handleKeyDown={handleKeyDown} type="message" />
        </Box>
    );
};

export default ChatWindow;
