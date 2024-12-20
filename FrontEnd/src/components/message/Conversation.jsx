import React, { useContext, useEffect, useState } from 'react'
import '../../assets/styles/message/Conversation.css'
import { handleScroll } from '../../services/infiniteScroll'
import { fetchMyConversations } from '../../services/conversationService'
import { ChatSocketContext } from '../../contexts/ChatSocketContext'
import { AuthContext } from '../../contexts/AuthContext'
import { Badge, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Typography, CardContent, CardActionArea, Card, Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const Conversation = () => {
    const { user } = useContext(AuthContext)
    const [hasMore, setHasMore] = useState(true)
    const { conversations, setConversations,
        openChatByConversation, unreadTotal } = useContext(ChatSocketContext)
    const [lastUpdate, setLastUpdate] = useState(null)

    const [dialogOpen, setDialogOpen] = useState(false)  // State để điều khiển mở/đóng Dialog

    const toggleDialog = () => {
        setDialogOpen(!dialogOpen)
    }

    useEffect(() => {
        if (user.id)
            loadMoreConversation()
    }, [user])

    const loadMoreConversation = async () => {
        if (!hasMore) return
        const data = await fetchMyConversations(lastUpdate)
        if (data) {
            setHasMore(data && data.length === 10)
            setConversations([...conversations, ...data]);
            if (data.length === 10)
                setLastUpdate(data.at(-1).lastUpdate)
        }
    }

    const handleClickConversation = (conversation) => {
        setDialogOpen(false)  // Đóng Dialog khi chọn cuộc trò chuyện
        openChatByConversation(conversation)
    }

    return (
        <div>
            <Tooltip title="Cuộc trò chuyện" arrow>
                <IconButton onClick={toggleDialog} color="inherit">
                    <Badge badgeContent={unreadTotal} color="error" overlap="circular">
                        <ChatBubbleOutlineIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                PaperProps={{
                    sx: {
                        width: 300,
                        height: 300,
                        overflowY: 'auto',
                        position: 'absolute',
                        top: 50,
                        right: 10,
                    }
                }}>
                <DialogTitle>Cuộc trò chuyện</DialogTitle>
                <DialogContent onScroll={event => handleScroll(event, loadMoreConversation)}>
                    <div>
                        {conversations.length === 0 && <Typography variant="body2" sx={{ padding: 2 }}>Không có cuộc trò chuyện nào.</Typography>}
                        <Box sx={{ maxWidth: 320, margin: '0 auto' }}>
                            {conversations.length > 0 &&
                                conversations.map(conversation => (
                                    <Card
                                        key={conversation.id}
                                        sx={{
                                            marginBottom: 1, 
                                            borderRadius: 1,
                                            boxShadow: conversation.read
                                                ? 'none'
                                                : '0 2px 6px rgba(0, 0, 0, 0.1)', 
                                            backgroundColor: conversation.read ? '#f9f9f9' : '#e8f4fd',
                                        }}>
                                        <CardActionArea
                                            onClick={() => handleClickConversation(conversation)}
                                            sx={{
                                                padding: '4px 8px', // Thu nhỏ padding
                                                '&:hover': {
                                                    backgroundColor: '#cce7f9', // Hover nhẹ hơn
                                                },
                                            }}>
                                            <CardContent sx={{ padding: '4px 8px' }}>
                                                <Typography
                                                    variant="body1" // Font size nhỏ hơn
                                                    sx={{
                                                        fontWeight: conversation.read ? '400' : '700',
                                                        color: conversation.read ? '#757575' : '#1565c0',
                                                    }}
                                                >
                                                    {conversation.name}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                ))}
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Conversation
