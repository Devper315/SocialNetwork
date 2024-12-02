import React from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const FriendTab = ({ friends, openChatByFriend }) => {
    return (
        <List>
            {friends.map((friend) => (
                <ListItem key={friend.id}>
                    <ListItemText primary={friend.fullName} />
                    <Button variant="contained" onClick={() => openChatByFriend(friend)}>
                        Nhắn tin
                    </Button>
                </ListItem>
            ))}
            {friends.length === 0 && <Typography>Chưa có bạn bè.</Typography>}
        </List>
    );
};

export default FriendTab;
