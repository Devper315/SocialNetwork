import React, { useContext, useEffect, useState } from 'react';
import { Pagination, Card, Box, CardHeader, IconButton } from '@mui/material';
import { ChatSocketContext } from '../../contexts/ChatSocketContext';
import { fetchFriend } from '../../services/friendService';
import Friend from './Friend';

const FriendTab = () => {
    const [friends, setFriends] = useState([])
    const [pagination, setPagination] = useState({ page: 1, totalPages: null })

    const fetchData = async () => {
        const data = await fetchFriend(pagination.page, 10)
        console.log(data.result)
        setFriends(data.result || [])
        setPagination({ ...pagination, totalPages: data.totalPages })
    }

    useEffect(() => {
        fetchData()
    }, [pagination.page])

    return (
        <>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={3}>
                {friends.map(friend => (
                    <Friend user={friend} />
                ))}
            </Box>
            {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={(_, page) => setPagination(prev => ({ ...prev, page }))}
                        color="primary"
                    />
                </Box>
            )}
        </>
    );
};

export default FriendTab;
