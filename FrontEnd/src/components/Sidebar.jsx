import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Collapse, List, ListItemButton, Typography } from "@mui/material";
import React, { useState } from "react";


const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null)

    const toggleMenu = index => {
        if (openMenu === index) setOpenMenu(null)
        else setOpenMenu(index)
    }

    return (
        <>
            <List disablePadding>
                <ListItemButton onClick={() => toggleMenu(1)}>
                    {openMenu === 1 ? <ExpandLess /> : <ExpandMore />}
                    <Typography>Menu 1</Typography>

                </ListItemButton>
                <Collapse in={openMenu === 1} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography variant="body1">Menu 1.1</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={() => toggleMenu(2)}>
                    {openMenu === 2 ? <ExpandLess /> : <ExpandMore />}
                    <Typography>Menu 2</Typography>

                </ListItemButton>
                <Collapse in={openMenu === 2} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <Typography variant="body1">Menu 2.1</Typography>
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </>
    )
}

export default Sidebar