import react, { useContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './common/Homepage';
import FriendList from './friend/FriendList';
import Register from './common/Register';
import PostPage from './post/PostPage';
import Profile from './user/Profile';
import GroupList from './group/GroupList';
import GroupDetail from './group/GroupDetail';
import EmailVerification from './common/EmailVerification';
import PendingPosts from './group/PendingPosts';
import { Box, IconButton, MenuItem, Tooltip, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import MenuIcon from "@mui/icons-material/Menu";
import Login from './common/Login';

const Body = () => {
    const { user } = useContext(AuthContext)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen)
    }


    return (
        <Box display={"flex"} mt={2}>
            {user &&
                <Box position="fixed" textAlign="left">
                    <Tooltip title={sidebarOpen ? "Đóng menu" : "Mở menu"}>
                        <IconButton color="inherit" onClick={toggleSidebarOpen} sx={{
                            transition: "transform 0.3s",
                            transform: sidebarOpen ? "rotate(90deg)" : "rotate(0deg)"
                        }}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{
                        width: sidebarOpen ? "250px" : 0,
                        height: "500px", overflow: "auto", border: "1px solid gray",
                        transition: "margin-left 0.3s ease"
                    }} >
                        <Sidebar />
                    </Box>
                </Box>}
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path='/login' element={<Login />} />
            </Routes>

            <Box ml={sidebarOpen ? "350px" : "230px"} width="900px" transition="0.3s">
                <Routes>
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
            </Box>

        </Box>

    )
}

export default Body