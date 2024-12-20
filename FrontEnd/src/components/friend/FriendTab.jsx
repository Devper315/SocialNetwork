import React, { useEffect, useState } from 'react';
import { Pagination, Box } from '@mui/material';
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
        <>
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
        </>
    );
};

export default FriendTab;
