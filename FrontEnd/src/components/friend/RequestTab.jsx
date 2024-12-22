import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Typography, Box, Pagination, Avatar } from '@mui/material';
import { fetchFriendRequest, actionFriendRequestByUserId } from '../../services/friendService';
import { Link } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';

const RequestTab = () => {
    const [requests, setRequests] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const updateFriendRequest = (userId, accept) => {
        actionFriendRequestByUserId(userId, accept)
        setRequests(requests.map(requestor =>
            requestor.id === userId
                ? { ...requestor, status: accept ? 'chấp nhận' : 'từ chối' }
                : requestor))
    }

    const fetchData = async () => {
        const data = await fetchFriendRequest(page, 5)
        console.log(data.result)
        setRequests(data.result || [])
        setTotalPages(data.totalPages)
    }

    useEffect(() => {
        fetchData()
    }, [page])
    return (
        <>
            <List>
                {requests.length > 0 ? (
                    requests.map((requestor) => (
                        <ListItem key={requestor.id} sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Link to={`/profile/${requestor.id}`} style={{ textDecoration: 'none' }}>
                                <Avatar src={requestor.avatarUrl}
                                    sx={{ mr: 2, width: 56, height: 56 }} />
                            </Link>
                            <Box sx={{ flexGrow: 1 }}>
                                <Link to={`/profile/${requestor.id}`}
                                    style={{ textDecoration: 'none', color: '#000' }}>
                                    <ListItemText primary={requestor.fullName} />
                                </Link>
                            </Box>
                            {requestor.status && <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {requestor.status === 'chấp nhận' &&
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: 'green',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '16px',
                                            fontWeight: 'bold',
                                        }}>
                                        <CheckCircle sx={{ marginRight: 1 }} />
                                        <Typography sx={{ mr: 1 }}>Chấp nhận</Typography>
                                    </Box>}
                                {requestor.status === 'từ chối' &&
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '16px',
                                            fontWeight: 'bold',
                                        }}>
                                        <Cancel sx={{ marginRight: 1 }} />
                                        <Typography sx={{ mr: 1 }}>Từ chối</Typography>
                                    </Box>}
                            </Box>}
                            {!requestor.status &&
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="contained" color="primary"
                                        onClick={() => updateFriendRequest(requestor.id, true)}>
                                        Chấp nhận
                                    </Button>
                                    <Button variant="outlined"
                                        onClick={() => updateFriendRequest(requestor.id, false)}
                                        sx={{
                                            fontWeight: 'bold',
                                            borderColor: '#d32f2f', 
                                            color: '#d32f2f', 
                                            '&:hover': {
                                                borderColor: '#c62828', 
                                                backgroundColor: '#ffebee', 
                                            },
                                        }} >
                                        Từ chối
                                    </Button>

                                </Box>}
                        </ListItem>
                    ))
                ) : (
                    <Typography textAlign="center" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Không có lời mời kết bạn nào.
                    </Typography>
                )}
            </List>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination count={totalPages} page={page}
                        onChange={(_, newPage) => setPage(newPage)} color="primary" />
                </Box>
            )}
        </>
    );
};

export default RequestTab;
