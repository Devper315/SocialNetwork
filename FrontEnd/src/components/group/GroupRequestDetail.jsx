import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { actionGroupRequest } from "../../services/groupService";


const GroupRequestDetail = ({ request, group, setGroup }) => {
    const navigate = useNavigate()
    const [action, setAction] = useState('')

    const handleAccept = (accept) => {
        setAction(accept ? "accept" : "reject")
        setGroup({
            ...group,
            totalMember: accept ? group.totalMember + 1 : group.totalMember,
            totalRequest: group.totalRequest - 1
        })
        actionGroupRequest(request.id, accept)
    }

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box gap={1} onClick={() => navigate(`/profile/${request.requestor.id}`)}
                    sx={{
                        cursor: "pointer", width: "200px",
                        borderRadius: "20px", backgroundColor: "#E0E0E0",
                        display: "flex", alignItems: "center", p: "5px 20px 5px 15px"
                    }}>
                    <Avatar src={request.requestor.avatarUrl}>
                        {request.requestor.fullName[0]}
                    </Avatar>
                    <Box>
                        <Typography fontWeight="bold">{request.requestor.fullName}</Typography>
                        <Box display="flex" gap={1}>
                            <Typography variant="caption">
                                {format(request.time, 'HH:mm:ss dd/MM/yyyy')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {action === '' &&
                <>
                    <Button variant="outlined" color="success" onClick={() => handleAccept(true)}
                        sx={{
                            borderRadius: "20px", textTransform: "none", height: "40px",
                            fontWeight: "bold", borderWidth: 1
                        }} >
                        Chấp nhận
                    </Button>
                    <Button variant='outlined' color="error" onClick={() => handleAccept(false)}
                        sx={{
                            borderRadius: "20px", textTransform: "none", height: "40px",
                            fontWeight: "bold", borderWidth: 1
                        }} >
                        Từ chối
                    </Button>
                </>}
            {action === 'accept' &&
                <Box sx={{
                    display: "flex", alignItems: "center", backgroundColor: "#4caf50",
                    color: "white", borderRadius: "20px", fontWeight: "bold", padding: '4px 10px',
                }}>
                    <CheckCircleOutlineIcon sx={{ marginRight: "5px" }} />
                    Đã chấp nhận
                </Box>}
            {action === 'reject' &&
                <Box sx={{
                    display: "flex", alignItems: "center", backgroundColor: "#e57373",
                    color: "white", borderRadius: "20px", fontWeight: "bold", padding: '4px 10px',
                }}>
                    <CancelOutlinedIcon sx={{ marginRight: "5px" }} />
                    Đã từ chối
                </Box>}
        </Box>
    )
}

export default GroupRequestDetail