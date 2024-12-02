import React from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const RequestTab = ({ requests, updateFriendRequest }) => {
    return (
        <List>
            {requests.map((request) => (
                <ListItem key={request.id}>
                    <ListItemText primary={request.requestor.fullName} />
                    {request.status ? (
                        <Typography>{request.status}</Typography>
                    ) : (
                        <>
                            <Button variant="contained" color="primary" onClick={() => updateFriendRequest(request.id, true)}>
                                Chấp nhận
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => updateFriendRequest(request.id, false)}>
                                Xóa yêu cầu
                            </Button>
                        </>
                    )}
                </ListItem>
            ))}
            {requests.length === 0 && <Typography>Không có lời mời kết bạn nào.</Typography>}
        </List>
    );
};

export default RequestTab;
