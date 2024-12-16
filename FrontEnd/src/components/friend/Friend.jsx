import { Avatar, Card, CardHeader, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ChatSocketContext } from "../../contexts/ChatSocketContext";


const Friend = ({ user }) => {
    const { openChatByFriend } = useContext(ChatSocketContext)

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
        console.log(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleOpenChat = (friend) => {
        handleMenuClose()
        openChatByFriend(friend)
    }

    return (
        <Card
            key={user.id}
            sx={{
                borderRadius: 2, // Bo góc
                backgroundColor: '#f5f5f5', // Nền xám nhạt
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Hiệu ứng bóng
                transition: 'transform 0.3s ease, background-color 0.3s ease', // Hiệu ứng hover
                '&:hover': {
                    transform: 'scale(1.05)', // Phóng to nhẹ
                    backgroundColor: '#e0e0e0', // Nền đậm hơn khi hover
                },
                position: "relative"
            }}>
            <CardHeader
                avatar={
                    <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }}>
                        <Avatar alt={user.fullName} src={user.avatarUrl} sx={{ width: 60, height: 60 }}>
                            {user.fullName[0]}
                        </Avatar>
                    </Link>
                }
                title={
                    <Link
                        to={`/profile/${user.id}`}
                        style={{
                            textDecoration: 'none',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            position: "absolute", left: 100, bottom: 27
                        }}>
                        {user.fullName}
                    </Link>}
                sx={{ paddingBottom: 1 }} />
            <IconButton onClick={handleMenuOpen} sx={{ position: "absolute", top: 5, right: 1 }}>
                <MoreVertIcon sx={{transform: 'rotate(90deg)'}}/>
            </IconButton>
            <Menu sx={{ position: "absolute", top: 35, right: 1 }}
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <MenuItem sx={{fontWeight: "bold"}} onClick={() => handleOpenChat(user)}>Gửi tin nhắn</MenuItem>
            </Menu>
        </Card>
    )
}

export default Friend