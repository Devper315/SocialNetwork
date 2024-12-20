import React, { useContext } from "react";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Person, Security, Group } from "@mui/icons-material"


const GroupMember = ({ group, member, userGroupContext }) => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    console.log(member)

    return (
        <Box display="flex" gap={1} alignItems="center" mb={1}>
            <Box gap={1} onClick={() => navigate(`/profile/${member.id}`)}
                sx={{
                    cursor: "pointer",
                    borderRadius: "20px", backgroundColor: "#E0E0E0",
                    display: "flex", alignItems: "center", p: "5px 10px 5px 5px"
                }}>
                <Avatar src={member.avatarUrl}>
                    {member.fullName[0]}
                </Avatar>
                <Box textAlign="center">
                    <Typography fontWeight="bold">{member.fullName}</Typography>
                    <Box display="flex" gap={1}>
                        {member.groupRole === "OWNER" && <Security sx={{ fontSize: 16, color: "gold" }} />}
                        {member.groupRole === "APPROVER" && <Person sx={{ fontSize: 16, color: "blue" }} />}
                        {member.groupRole === "MEMBER" && <Group sx={{ fontSize: 16, color: "green" }} />}
                        <Typography variant="caption">
                            {member.groupRole === "OWNER" && "Quản trị viên"}
                            {member.groupRole === "APPROVER" && "Người kiểm duyệt"}
                            {member.groupRole === "MEMBER" && "Thành viên"}
                        </Typography>
                    </Box>
                </Box>

            </Box>

            {userGroupContext.owner && member.id !== user.id &&
                <>
                    <Button variant="outlined" color="warning"
                        sx={{
                            borderRadius: "20px", textTransform: "none", height: "40px",
                            fontWeight: "bold", borderWidth: 2
                        }} startIcon={<ManageAccountsIcon />}>
                        Nhượng quyền
                    </Button>
                    <Button variant='outlined' color="error"
                        sx={{
                            borderRadius: "20px", textTransform: "none", height: "40px",
                            fontWeight: "bold", borderWidth: 2
                        }} startIcon={<DeleteIcon />}>
                        Xóa khỏi nhóm
                    </Button>
                </>}
        </Box>
    )
}

export default GroupMember