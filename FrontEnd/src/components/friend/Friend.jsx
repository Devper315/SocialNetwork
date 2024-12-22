import { Avatar, Card, CardHeader, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ChatSocketContext } from "../../contexts/ChatSocketContext";


const Friend = ({ user }) => {
    const { openChatByFriend } = useContext(ChatSocketContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl)
    const navigate = useNavigate()

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleOpenChat = (friend) => {
        handleMenuClose()
        openChatByFriend(friend)
    }

    return (
        <Card key={user.id}
            sx={{
                borderRadius: 2, backgroundColor: '#f5f5f5',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: '#e0e0e0',
                },
                position: "relative"
            }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{p: 1}}>
                <Avatar src={user.avatarUrl} sx={{ width: 60, height: 60, cursor: "pointer",
                    border: "1px solid #ddd"
                 }}
                    onClick={() => navigate(`/profile/${user.id}`)}>
                    {user.lastName[0]}
                </Avatar>
                <Typography sx={{
                    color: '#333', fontWeight: 'bold', fontSize: "17px", cursor: "pointer"
                }} onClick={() => navigate(`/profile/${user.id}`)}>
                    {user.fullName}
                </Typography>
            </Stack>
            <IconButton onClick={handleMenuOpen} sx={{ position: "absolute", top: 5, right: 1 }}>
                <MoreVertIcon sx={{ transform: 'rotate(90deg)' }} />
            </IconButton>
            <Menu sx={{ position: "absolute", top: 35, right: 1 }}
                anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <MenuItem sx={{ fontWeight: "bold" }} onClick={() => handleOpenChat(user)}>Gửi tin nhắn</MenuItem>
            </Menu>
        </Card>
    )
}

export default Friend