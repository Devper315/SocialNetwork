import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Homepage from './components/common/Homepage';
import FriendList from './components/friend/FriendList';
import Register from './components/common/Register';
import PostPage from './components/post/PostPage';
import Profile from './components/user/Profile';
import React from 'react';
import GroupList from './components/group/GroupList';
import GroupDetail from './components/group/GroupDetail';
import EmailVerification from './components/common/EmailVerification';
import PendingPosts from './components/group/PendingPosts';


function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path='/friends' element={<FriendList />} />
                <Route path='/group' element={<GroupList />} />
                <Route path='/group-detail/:id' element={<GroupDetail />} />
                <Route path='/messages' element={<Homepage />} />
                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/register' element={<Register />} />
                <Route path='/postpage/:id' element={<PostPage />} />
                <Route path='/register/verify/' element={<EmailVerification />} />
                <Route path="/pending-posts/:groupId" element={<PendingPosts />} />
            </Routes>
        </div>
    );
}

export default App;
