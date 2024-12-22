import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Tooltip, Menu, MenuItem, ListItemIcon } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import { AuthContext } from "../../contexts/AuthContext";
import Conversation from "../message/Conversation";
import Notification from "../user/Notification";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";


const Header = () => {
    const { user, logout } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const isMenuOpen = Boolean(anchorEl)
    return (
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    {/* Icon Trang chủ */}
                    <Tooltip title="Trang chủ">
                        <IconButton component={Link} to="/" color="inherit">
                            <HomeIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>

                    <Box display="flex" alignItems="center" gap={10}>
                        {user && (
                            <>
                                <Tooltip title="Trang chủ">
                                    <IconButton component={Link} to="/" color="inherit">
                                        <HomeIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Bạn bè">
                                    <IconButton component={Link} to="/friends" color="inherit">
                                        <PeopleIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Nhóm">
                                    <IconButton component={Link} to="/group" color="inherit">
                                        <GroupsIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Conversation />
                                <Notification />
                            </>
                        )}
                    </Box>

                    <IconButton color="inherit" onClick={handleMenuOpen}
                        sx={{
                            transition: "transform 0.3s",
                            transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                        }}>
                        <MenuIcon fontSize="large" />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}>
                        {!user && <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Đăng nhập
                        </MenuItem>}
                        {user &&
                            <>
                                <MenuItem component={Link} to={`/profile/${user.id}`} onClick={handleMenuClose}>
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    Trang cá nhân
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    logout();
                                    handleMenuClose();
                                }}>
                                    <ListItemIcon>
                                        <ExitToAppIcon fontSize="small" />
                                    </ListItemIcon>
                                    Đăng xuất
                                </MenuItem>
                            </>}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
