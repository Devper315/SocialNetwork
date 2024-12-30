import { useContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './Homepage';
import FriendList from '../friend/FriendList';
import Register from './Register';
import PostPage from '../post/PostPage';
import Profile from '../user/Profile';
import GroupList from '../group/GroupList';
import GroupDetail from '../group/GroupDetail';
import EmailVerification from './EmailVerification';
import { Box, IconButton, Tooltip } from '@mui/material';
import Sidebar from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import MenuIcon from "@mui/icons-material/Menu";
import Login from './Login';

const Body = () => {
    const { user } = useContext(AuthContext)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen)
    }


    return (
        <Box display={"flex"} pt={10} sx={{ backgroundColor: "#f0f0f0", minHeight: "1000px" }}>
            {user &&
                <Box position="fixed" textAlign="left">
                    <Tooltip title={sidebarOpen ? "Đóng menu" : "Mở menu"}>
                        <IconButton color="inherit" onClick={toggleSidebarOpen} sx={{
                            transition: "transform 0.3s", color: sidebarOpen ? "#0288d1" : "black",
                            transform: sidebarOpen ? "rotate(90deg)" : "rotate(0deg)"
                        }}>
                            <MenuIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        width: sidebarOpen ? "250px" : 0,
                        height: "1000px", overflow: "auto",
                        transition: "margin-left 0.3s ease",
                        boxShadow: sidebarOpen ? "0 16px 16px 16px rgba(0, 0, 0, 0.1)" : "none",
                    }} >
                        <Sidebar setSidebarOpen={setSidebarOpen} />
                    </Box>
                </Box>}
            <Routes name="routes">
                <Route path='/' element={<Homepage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/profile/:id' element={<Profile />} />
            </Routes>

            <Box ml={sidebarOpen ? "350px" : "230px"} width="900px" transition="0.3s">
                <Routes>
                    <Route path='/friends' element={<FriendList />} />
                    <Route path='/group' element={<GroupList />} />
                    <Route path='/group-detail/:id' element={<GroupDetail />} />
                    <Route path='/messages' element={<Homepage />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/postpage/:id' element={<PostPage />} />
                    <Route path='/register/verify/' element={<EmailVerification />} />
                </Routes>
            </Box>

        </Box>

    )
}

export default Body