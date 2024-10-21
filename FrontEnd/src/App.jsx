import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Homepage from './components/common/Homepage';
import FriendList from './components/user/FriendList';
import MyProfile from './components/user/MyProfile';
import Register from './components/common/Register';
import PostPage from './components/post/PostPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/friends' element={<FriendList />} />
        <Route path='/groups' element={<Homepage />} />
        <Route path='/messages' element={<Homepage />} />
        <Route path='/notifications' element={<Homepage />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/register' element={<Register />} />
        <Route path='/postpage' element={<PostPage />} />
      </Routes>
    </div>
  );
}

export default App;
