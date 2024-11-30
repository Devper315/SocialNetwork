import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Login from './Login';
import PostList from '../post/PostList';

const HomePage = () => {
    const { isLoggedIn } = useContext(AuthContext)

    return (
        <div>
            {!isLoggedIn && <Login />}
            {isLoggedIn && <PostList />}
        </div>
    )
}

export default HomePage;
