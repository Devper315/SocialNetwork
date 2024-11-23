import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import '../../assets/styles/user/video-call/VideoCallModal.css';

const VideoCallPortal = ({ 
    localVideoRef, 
    remoteVideoRef, 
    handleCloseVideoCall, 
    sendSignal, 
    action, 
    recipientRef, 
    startVideoStream, 
    show 
}) => {
    useEffect(() => {
        const startVideo = async () => {
            if (localVideoRef.current && show) {
                await startVideoStream();
                sendSignal({ type: action, recipient: recipientRef.current });
            }
        };
        startVideo();
    }, [localVideoRef, recipientRef, show]);

    return ReactDOM.createPortal(
        <Dialog open={show} onClose={handleCloseVideoCall} fullWidth maxWidth="md">
            <DialogTitle>Video Call</DialogTitle>
            <DialogContent>
                <div className="video-container">
                    <video ref={localVideoRef} autoPlay muted className="local-video" />
                    <video ref={remoteVideoRef} autoPlay className="remote-video" />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseVideoCall} color="secondary" variant="outlined">
                    Kết thúc cuộc gọi
                </Button>
            </DialogActions>
        </Dialog>,
        document.getElementById('portal-root')
    );
};

export default VideoCallPortal;
