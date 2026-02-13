import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import { Verified, Security, Group, VerifiedUser, RemoveModerator } from "@mui/icons-material"
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { set } from "date-fns"
import GroupActionConfirm from "./GroupActionConfirm"



const GroupMemberDetail = ({ member, updateMember, userGroupContext }) => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [actionConfirm, setActionConfirm] = useState({})

    const buttonStyle = {
        borderRadius: "20px",
        textTransform: "none",
        height: "40px",
        fontWeight: "bold",
        borderWidth: 2,
        padding: "0 10px 0px 10px"
    }

    const roleIcons = {
        OWNER: <Security sx={{ fontSize: 16, color: "gold" }} />,
        APPROVER: <Verified color="info" sx={{ fontSize: 16 }} />,
        MEMBER: <Group sx={{ fontSize: 16, color: "green" }} />
    }

    const roleTitles = {
        OWNER: "Quản trị viên",
        APPROVER: "Người kiểm duyệt",
        MEMBER: "Thành viên"
    }

    const diaglogMap = {
        transfer: {
            action: "transfer",
            icon: <ManageAccountsIcon />,
            title: 'Xác nhận nhượng quyền',
            body: `Bạn có chắc muốn nhượng quyền chủ nhóm cho ${member.fullName} ?`,
            color: 'warning'
        },
        assign: {
            action: "assign",
            icon: <VerifiedUser />,
            title: 'Xác nhận ủy quyền',
            body: `Bạn có chắc muốn ủy quyền kiểm duyệt viên cho ${member.fullName} ?`,
            color: "info"
        },
        revoke: {
            action: "revoke",
            icon: <RemoveModerator />,
            title: 'Xác nhận thu hồi quyền',
            body: `Bạn có chắc muốn thu hồi quyền kiểm duyệt viên của ${member.fullName} ?`,
            color: "error"
        },
        remove: {
            action: "remove",
            icon: <PersonOffIcon />,
            title: 'Xác nhận xóa',
            body: `Bạn có chắc xóa ${member.fullName} khỏi nhóm ?`,
            color: "error"
        },
    }

    const handleClickMoreVert = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleOpenConfirm = (action) => {
        setActionConfirm(diaglogMap[action])
        setShowConfirm(true)
    }

    const handleConfirm = () => {
        updateMember(member, actionConfirm.action)
        handleCloseConfirm()
        setAnchorEl(null)
    }

    const handleCloseConfirm = () => {
        setShowConfirm(false)
    }

    return (
        <Box display="flex" gap={1} alignItems="center" mb={1}>
            <Box gap={1} onClick={() => navigate(`/profile/${member.id}`)}
                sx={{
                    cursor: "pointer", width: "250px",
                    borderRadius: "20px", backgroundColor: "#f5f5f5",
                    display: "flex", alignItems: "center", p: "5px 20px 5px 15px"
                }}>
                <Avatar src={member.avatarUrl}>
                    {member.fullName[0]}
                </Avatar>
                <Box textAlign="center">
                    <Box display="flex">
                        <Typography fontWeight="bold">
                            {member.fullName}
                        </Typography>
                        {user.id === member.id && <Typography sx={{ marginLeft: "5px" }}>
                            {"(bạn)"}
                        </Typography>}
                    </Box>
                    <Box display="flex" gap={1}>
                        {roleIcons[member.groupRole]}
                        <Typography variant="caption">
                            {roleTitles[member.groupRole]}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {userGroupContext.owner && member.id !== user.id &&
                <>
                    <Tooltip title="Tùy chọn">
                        <IconButton onClick={handleClickMoreVert}>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                border: "1px solid #ddd", borderRadius: '8px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', padding: '5px',
                            }
                        }}>
                        <MenuItem sx={{ padding: "0 10px 5px 10px" }}>
                            <Button variant="outlined" color="warning" onClick={() => handleOpenConfirm("transfer")}
                                sx={buttonStyle} startIcon={<ManageAccountsIcon />}>
                                Nhượng quyền chủ nhóm
                            </Button>
                        </MenuItem>

                        {member.groupRole === "MEMBER"
                            && <MenuItem sx={{ padding: "0 10px 5px 10px" }}>
                                <Button variant="outlined" color="info" onClick={() => handleOpenConfirm("assign")}
                                    sx={buttonStyle} startIcon={<Verified />}>
                                    Ủy quyền kiểm duyệt viên
                                </Button>
                            </MenuItem>}

                        {member.groupRole === "APPROVER"
                            && <MenuItem sx={{ padding: "0 10px 5px 10px" }}>
                                <Button variant="outlined" color="error" onClick={() => handleOpenConfirm("revoke")}
                                    sx={buttonStyle} startIcon={<RemoveModerator />}>
                                    Thu hồi quyền kiểm duyệt viên
                                </Button>
                            </MenuItem>}

                        <MenuItem sx={{ padding: "0 10px 5px 10px" }}>
                            <Button variant='outlined' color="error" onClick={() => handleOpenConfirm("remove")}
                                sx={buttonStyle} startIcon={<PersonOffIcon />}>
                                Xóa khỏi nhóm
                            </Button>
                        </MenuItem>
                    </Menu>
                    <GroupActionConfirm open={showConfirm} onClose={handleCloseConfirm}
                        actionConfirm={actionConfirm} onConfirm={handleConfirm} />
                </>}
        </Box>
    )
}

export default GroupMemberDetail