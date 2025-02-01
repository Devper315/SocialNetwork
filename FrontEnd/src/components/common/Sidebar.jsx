import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Collapse, List, ListItemButton, ListItemIcon, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../contexts/MenuContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import HomeIcon from "@mui/icons-material/Home"
import PeopleIcon from "@mui/icons-material/People"
import GroupIcon from "@mui/icons-material/Groups"
import PersonIcon from "@mui/icons-material/Person"


const Sidebar = ({ setSidebarOpen }) => {
    const { activeMenu, setActiveMenu, friendMenu, setFriendMenu, groupMenu, setGroupMenu } = useContext(MenuContext)
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    useEffect(() => {
        if ([2, 3].includes(activeMenu)) {
            setSidebarOpen(true)
        }
        sessionStorage.setItem('activeMenu', activeMenu);
    }, [activeMenu])


    const menuList = [
        {
            id: 1,
            label: 'Trang chủ',
            route: '/',
            icon: HomeIcon
        },
        {
            id: 2,
            label: 'Bạn bè',
            route: '/friends',
            type: 'friend',
            icon: PeopleIcon,
            children: [
                { id: 1, label: 'Danh sách bạn bè' },
                { id: 2, label: 'Lời mời kết bạn' },
                { id: 3, label: 'Tìm kiếm' },
            ],
        },
        {
            id: 3,
            label: 'Nhóm',
            type: 'group',
            route: '/group',
            icon: GroupIcon,
        },
        {
            id: 4,
            label: 'Trang cá nhân',
            route: `/profile/${user.id}`,
            icon: PersonIcon
        },
    ]

    const handleClickSubMenu = (type, menuId) => {
        if (type === 'friend') setFriendMenu(menuId)
        else if (type === 'group') setGroupMenu(menuId)
    }

    const handleClickMenu = (menuId, route) => {
        if (activeMenu !== menuId) {
            setActiveMenu(menuId)
            navigate(route)
        }
    }

    const handleClickExpandMenu = (menuId) => {
        if (activeMenu === menuId) setActiveMenu(null)
        else setActiveMenu(menuId)
    }

    return (
        <>
            <List disablePadding>
                {menuList.map(menu =>
                    <>
                        <ListItemButton sx={{ pl: 1,
                            backgroundColor: activeMenu === menu.id ? 'rgba(0, 0, 0, 0.05)' : "#fff",
                         }}>
                            <Stack direction="column" justifyContent="center" 
                                onClick={() => handleClickExpandMenu(menu.id)}
                                sx={{
                                    borderRadius: "50%",
                                    mr: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                }}>
                                {menu.children && (activeMenu === menu.id ? <ExpandLess /> : <ExpandMore />)}
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={1}
                                sx={{ pl: menu.children ? 0 : "22px" }}>
                                <menu.icon sx={{ color: activeMenu === menu.id ? "#0288d1" : "gray" }} />
                                <Typography fontWeight={activeMenu === menu.id ? "bold" : "250px"}
                                    sx={{ mt: "5px",  color: activeMenu === menu.id ? "#0288d1" : "black"}}
                                    onClick={() => handleClickMenu(menu.id, menu.route)} >
                                    {menu.label}
                                </Typography>
                            </Stack>


                        </ListItemButton>
                        {menu.children &&
                            <Collapse in={activeMenu === menu.id} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                    {menu.children.map(child =>
                                        <ListItemButton key={child.id} sx={{ pl: 5 }}
                                            onClick={() => handleClickSubMenu(menu.type, child.id)}>
                                            <Typography variant="body1">{child.label}</Typography>
                                        </ListItemButton>
                                    )}
                                </List>
                            </Collapse>
                        }
                    </>
                )}
            </List>
        </>
    )
}

export default Sidebar