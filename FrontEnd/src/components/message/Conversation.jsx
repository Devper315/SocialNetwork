import React, { useContext, useEffect, useState } from 'react'
import '../../assets/styles/message/Conversation.css'
import { handleScroll } from '../../services/infiniteScroll'
import { fetchMyConversations } from '../../services/conversationService'
import { ChatSocketContext } from '../../contexts/ChatSocketContext'
import { AuthContext } from '../../contexts/AuthContext'
import { Badge, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
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
                    }}}>
                <DialogTitle>Cuộc trò chuyện</DialogTitle>
                <DialogContent onScroll={event => handleScroll(event, loadMoreConversation)}>
                    <div>
                        {conversations.length === 0 && <Typography variant="body2" sx={{ padding: 2 }}>Không có cuộc trò chuyện nào.</Typography>}
                        {conversations.length > 0 && conversations.map(conversation => (
                            <div style={{ height: 50 }} className='conversation-item'
                                key={conversation.id}
                                onClick={() => handleClickConversation(conversation)}>
                                <span className={conversation.read ? '' : 'unread'}>{conversation.name}</span>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Conversation
