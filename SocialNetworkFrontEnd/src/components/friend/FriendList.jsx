import React, { useContext, useEffect, useState } from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import FriendTab from './FriendTab'
import RequestTab from './RequestTab'
import SearchTab from './SearchTab'
import { MenuContext } from '../../contexts/MenuContext'

const FriendList = () => {
    const {friendMenu} = useContext(MenuContext)

    return (

        <Box sx={{ marginY: "4px" }}>
            {friendMenu === 1 && <FriendTab />}
            {friendMenu === 2 && <RequestTab />}
            {friendMenu === 3 && <SearchTab />}
        </Box>
    )
}

export default FriendList
