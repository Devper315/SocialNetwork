import React, { useContext, useEffect } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Stack, CardMedia } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

    const titleStyle = {
        borderBottom: '2px solid #ccc', display: 'flex', py: 1,
        justifyContent: 'space-between', alignItems: 'center'
    }

    const remoteIconStyle = {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        color: "gray",
    }


    return (
        <Dialog open={show} onClose={handleCloseVideoCall} maxWidth={false}>
            <DialogTitle sx={titleStyle}>
                {`Cuộc gọi với ${recipientFullName}`}
                <IconButton color="inherit" onClick={handleCloseVideoCall}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{
                overflow: 'hidden', height: 1000, width: 833, py: 0
            }}>
                <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
                    <Box sx={{
                        height: "30%", width: "auto", position: "absolute", bottom: 0, right: 0,
                        border: "1px solid #ddd"
                    }}>
                        <video ref={localVideoRef} autoPlay muted
                            style={{ display: isCameraOn ? "block" : "none", width: "100%", height: "100%" }} />
                        <CardMedia component="img" image={user ? user.avatarUrl : ""} alt=''
                            sx={{ objectFit: "contain", height: '100%', }} />
                    </Box>
                    <Box sx={{ height: "100%", width: "100%" }}>
                        <video ref={remoteVideoRef} autoPlay
                            style={{ display: remoteCameraOn ? "block" : "none"}} />
                        {!remoteCameraOn && <Box sx={{ backgroundColor: "black", height: "100%" }} />}
                    </Box>

                    <Stack direction="row" spacing="10px"
                        sx={{ position: "absolute", bottom: 20, left: "45%" }}>
                        <Box sx={remoteIconStyle}>
                            {remoteCameraOn ? <VideoCamIcon /> : <VideoCamOffIcon />}
                        </Box>
                        <Box sx={remoteIconStyle}>
                            {remoteMicOn ? <MicIcon /> : <MicOffIcon />}
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ borderTop: '2px solid #ccc', paddingX: 3 }}>
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
