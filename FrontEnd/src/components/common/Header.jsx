import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Typography, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { AuthContext } from "../../contexts/AuthContext";
import Conversation from "../message/Conversation";
import Notification from "../user/Notification";

const Header = () => {
    const { user } = useContext(AuthContext);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Tooltip title="Trang chủ">
                        <IconButton component={Link} to="/" color="inherit">
                            <HomeIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>

                    {user && <Tooltip title="Bạn bè">
                        <IconButton component={Link} to="/friends" color="inherit">
                            <PeopleIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>}
                    

                    {user && <Tooltip title="Nhóm">
                        <IconButton component={Link} to="/group" color="inherit">
                            <GroupsIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>}
                    

                    {user && <Conversation />}
                    

                    {user && <Notification />}
                    

                    {user && <Tooltip title="Trang cá nhân">
                        <IconButton component={Link} to={`/profile/${user.id}`} color="inherit">
                            <PersonIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>}

                    {user && <Tooltip title="Bài viết">
                        <IconButton component={Link} to="/post-list" color="inherit">
                            <PostAddIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>}
                    
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
