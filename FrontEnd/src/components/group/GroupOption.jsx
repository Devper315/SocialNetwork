import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import HighlightOff from '@mui/icons-material/HighlightOff';
import GroupDialog from "./GroupDialog";
import { uploadFileToFirebase } from "../../configs/firebaseSDK";
import { dissolveGroupById, removeGroupMember, updateGroup } from "../../services/groupService";
import GroupActionConfirm from "./GroupActionConfirm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";


const GroupOption = ({ group, setGroup, userGroupContext }) => {
    const { user } = useContext(AuthContext)
    const [editing, setEditing] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [actionConfirm, setActionConfirm] = useState({})
    const [cannotLeave, setCannotLeave] = useState(false)
    const navigate = useNavigate()

    const handleUpdateGroup = async (data) => {
        if (data.image) {
            const filePath = `group/${data.id}`
            const newImageUrl = await uploadFileToFirebase(data.image, filePath)
            data = { ...data, imageUrl: newImageUrl, image: null }
        }
        updateGroup(data)
        setGroup(data)
    }

    const buttonStyle = {
        fontWeight: "bold",
        borderRadius: "20px",
        width: "fit-content"
    }

    const options = {
        dissolve: {
            action: "dissolve",
            icon: <HighlightOff />,
            color: "error",
            title: "Xác nhận giải tán nhóm",
            body: `Bạn có chắc chắn muốn giải tán nhóm này không ?
                   Hành động này không thể hoàn tác và tất cả dữ liệu liên quan đến nhóm sẽ bị mất vĩnh viễn!`
        },

        leave: {
            action: "leave",
            icon: <DoorFrontIcon />,
            color: "warning",
            title: "Xác nhận rời nhóm",
            body: "Bạn có chắc muốn rời nhóm này ?"
        }
    }

    const handleOpenConfirm = (action) => {
        setActionConfirm(options[action])
        setShowConfirm(true)
    }

    const handleCloseConfirm = () => {
        setShowConfirm(false)
    }

    const handleConfirm = async () => {
        const action = actionConfirm.action
        if (action === "dissolve") {
            await dissolveGroupById(group.id)
            navigate("/group")
        }
        if (action === "leave") {
            if (userGroupContext.owner) setCannotLeave(true)
            else {
                removeGroupMember(group.id, user.id)
                navigate("/group")
            }
        }
        handleCloseConfirm()
    }


    return (
        <Box sx={{ minHeight: "250px", display: "flex", flexDirection: "column", gap: 1 }}>
            {userGroupContext.owner &&
                <>
                    <Button variant="outlined" color="info" sx={buttonStyle}
                        startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                        Sửa thông tin nhóm
                    </Button>
                    <GroupDialog open={editing} onClose={() => setEditing(false)}
                        onSubmit={handleUpdateGroup} group={group} />

                    <Button variant="outlined" color="error" sx={buttonStyle}
                        startIcon={<HighlightOff />} onClick={() => handleOpenConfirm("dissolve")}>
                        Giải tán nhóm
                    </Button>
                </>}
            {group.totalMember > 1 &&
                <Button variant="outlined" color="warning" sx={buttonStyle}
                    startIcon={<DoorFrontIcon />} onClick={() => handleOpenConfirm("leave")}>
                    Rời nhóm
                </Button>}

            <GroupActionConfirm open={showConfirm} onClose={handleCloseConfirm}
                actionConfirm={actionConfirm} onConfirm={handleConfirm} />

            <Dialog open={cannotLeave} onClose={() => setCannotLeave(false)}>
                <DialogTitle color="warning" sx={{
                    display: "flex", gap: 1, alignItems: "center", p: "5px 23px",
                    borderBottom: "1px solid #ccc", mb: 1
                }}>
                    Hành động không hợp lệ
                </DialogTitle>
                <DialogContent>
                    <Typography>Bạn cần nhượng quyền chủ nhóm trước khi rời.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" onClick={() => setCannotLeave(false)}
                        sx={{ textTransform: "none", fontWeight: "bold" }}>
                        OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default GroupOption