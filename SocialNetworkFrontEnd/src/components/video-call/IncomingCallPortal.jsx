import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const IncomingCallPortal = ({ incoming, openInComing, handleAcceptCall, handleRejectCall }) => {

    return (
        <Dialog open={openInComing} onClose={() => handleRejectCall()} fullWidth maxWidth="sm" centered>
            <DialogTitle>Cuộc gọi đến</DialogTitle>
            <DialogContent>
                <p>{incoming.callerName} đang gọi cho bạn</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAcceptCall} color="primary" variant="contained">
                    Chấp nhận
                </Button>
                <Button onClick={handleRejectCall} color="secondary" variant="outlined">
                    Từ chối
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IncomingCallPortal;
