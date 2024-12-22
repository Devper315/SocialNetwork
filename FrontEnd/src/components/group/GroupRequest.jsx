import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchGroupJoinRequests } from "../../services/groupService";

import GroupRequestDetail from "./GroupRequestDetail";

const GroupRequest = ({ group, setGroup, }) => {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        setGroup({
            ...group, totalRequest: requests.length
        })
    }, [requests])

    useEffect(() => {
        const getRequests = async () => {
            const requestData = await fetchGroupJoinRequests(group.id)
            setRequests(requestData)
        }
        getRequests()
    }, [])

    return (
        <Box sx={{ minHeight: "250px"}}>
            {requests && requests.length > 0 && requests.map(request =>
                <GroupRequestDetail request={request} group={group} setGroup={setGroup}/>
            )}
            {requests && requests.length === 0 &&
                <Typography variant="h6" fontWeight="bold">Không có yêu cầu tham gia nào.</Typography>}
        </Box>
    )
}

export default GroupRequest