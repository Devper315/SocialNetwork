import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";


const GroupActionConfirm = ({open, onClose, actionConfirm, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle color={actionConfirm.color} sx={{
                display: "flex", gap: 1, alignItems: "center", p: "5px 23px",
                borderBottom: "1px solid #ccc", mb: 1
            }}>
                {actionConfirm.icon} {actionConfirm.title}
            </DialogTitle>
            <DialogContent>
                <Typography sx={{whiteSpace: "pre-line", fontSize: 17,}}>
                    {actionConfirm.body}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} color={actionConfirm.color} variant="contained"
                    sx={{ textTransform: "none", fontWeight: "bold" }}>
                    Xác nhận
                </Button>
                <Button onClick={onClose} variant="outlined" color={actionConfirm.color}
                    sx={{ textTransform: "none", fontWeight: "bold" }}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GroupActionConfirm