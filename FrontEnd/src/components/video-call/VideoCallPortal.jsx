import React, { useContext, useEffect } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../assets/styles/user/video-call/VideoCallModal.css';
import VideoCamIcon from '@mui/icons-material/Videocam';
import VideoCamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { AuthContext } from '../../contexts/AuthContext';

const VideoCallPortal = ({ localVideoRef, remoteVideoRef, handleCloseVideoCall, isCameraOn, toggleCamera,
    isMicOn, toggleMic, remoteCameraOn, remoteMicOn, sendSignal, action, recipientRef, recipientFullName,
    startVideoStream, show, callType }) => {
    const { user } = useContext(AuthContext)
    useEffect(() => {
        const startVideo = async () => {
            if (show) {
                await startVideoStream();
                sendSignal({
                    type: action,
                    recipient: recipientRef.current,
                    incoming: {
                        callerName: user.fullName,
                        type: callType
                    }
                });
            }
        };
        startVideo();
    }, [recipientRef, show]);

    return (
        <Dialog open={show} onClose={handleCloseVideoCall} maxWidth={false}>
            <DialogTitle sx={{
                borderBottom: '2px solid #ccc', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center'
            }}>
                {`Cuộc gọi với ${recipientFullName}`}
                <IconButton edge="end" color="inherit" onClick={handleCloseVideoCall} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{
                overflow: 'hidden', height: 1000, width: 1000, borderBottom: '2px solid #ccc'
            }}>
                <div className="video-container">
                    <video ref={localVideoRef} autoPlay muted className="local-video" />
                    <video ref={remoteVideoRef} autoPlay className={remoteCameraOn ? "remote-video" : "hidden"} />
                    {!remoteCameraOn && <div className="no-remote-video" />}
                    <div className="icon-wrapper">
                        <div className="icon">
                            {remoteCameraOn ? <VideoCamIcon /> : <VideoCamOffIcon />}
                        </div>
                        <div className="icon">
                            {remoteMicOn ? <MicIcon /> : <MicOffIcon />}
                        </div>
                    </div>
                </div>
            </DialogContent>

            <DialogActions sx={{ borderTop: '2px solid #ccc' }}>
                <IconButton onClick={toggleCamera} sx={{ color: isCameraOn ? 'black' : 'gray' }}>
                    {isCameraOn ? <VideoCamIcon /> : <VideoCamOffIcon />}
                </IconButton>
                <IconButton onClick={toggleMic} sx={{ color: isMicOn ? 'black' : 'gray' }}>
                    {isMicOn ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
                <Button onClick={handleCloseVideoCall} variant="contained">
                    Kết thúc cuộc gọi
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default VideoCallPortal;
