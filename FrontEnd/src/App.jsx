import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Homepage from './components/common/Homepage';
import FriendList from './components/user/FriendList';
import Register from './components/common/Register';
import PostPage from './components/post/PostPage';
import PostList from './components/post/PostList';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './components/user/Profile';
import React from 'react';
import Notification from './components/user/Notification';
import Group from './components/user/Group';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/friends' element={<FriendList />} />
        <Route path='/group' element={<Group />} />
        <Route path='/messages' element={<Homepage />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/register' element={<Register />} />
        <Route path='/post-list' element={<PostList />} />
        <Route path='/postpage/:id' element={<PostPage />} />
      </Routes>
    </div>
  );
}

export default App;
