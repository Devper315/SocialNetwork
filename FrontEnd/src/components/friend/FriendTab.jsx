import React, { useEffect, useState } from 'react';
import { Pagination, Box, Typography } from '@mui/material';
import { fetchFriend } from '../../services/friendService';
import Friend from './Friend';

const FriendTab = () => {
    const [friends, setFriends] = useState([])
    const [pagination, setPagination] = useState({ page: 1, totalPages: null })

    const fetchData = async () => {
        const data = await fetchFriend(pagination.page, 10)
        setFriends(data.result || [])
        setPagination({ ...pagination, totalPages: data.totalPages })
    }

    useEffect(() => {
        fetchData()
    }, [pagination.page])

    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" textAlign="left" mb={1}>Danh sách bạn bè</Typography>
            <Box display="grid" gap={3}
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))">
                {friends.map(friend => (
                    <Friend user={friend} />
                ))}
            </Box>
            {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination
                        count={pagination.totalPages} page={pagination.page}
                        onChange={(_, page) => setPagination({ ...pagination, page })}
                        color="primary" />
                </Box>
            )}
        </Box>
    );
};

export default FriendTab;
