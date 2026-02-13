import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import PostList from '../post/PostList';
import { Box } from '@mui/material';

const HomePage = () => {
    const [posts, setPosts] = useState([])

    return (
        <Box sx={{ml: "28%"}}>
            <PostList posts={posts} setPosts={setPosts} />
        </Box>
    )
}

export default HomePage;
