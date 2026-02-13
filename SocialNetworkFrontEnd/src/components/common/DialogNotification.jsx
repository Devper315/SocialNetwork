import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const DialogNotification = ({open, onClose, content}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}
            sx={{ bottom: "150px" }}>
            <DialogTitle sx={{ borderBottom: '2px solid #ccc', display: 'flex', fontWeight: "bold" }}>
                Thông báo
            </DialogTitle>
            <DialogContent sx={{ width: 500, fontSize: "18px" }}>
                <p>{content}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogNotification