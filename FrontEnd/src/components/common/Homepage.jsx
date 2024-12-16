import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Login from './Login';
import PostList from '../post/PostList';
import { Box } from '@mui/material';

const HomePage = () => {
    const { isLoggedIn } = useContext(AuthContext) 
    const [posts, setPosts] = useState([])

    return (
        <Box sx={{position: "fixed", ml: "27%"}}>
            {isLoggedIn && <PostList posts={posts} setPosts={setPosts} />}
            {!isLoggedIn && <Login />}
        </Box>
    )
}

export default HomePage;
