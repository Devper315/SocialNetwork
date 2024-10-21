import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../../../assets/styles/user/video-call/VideoCallModal.css';

const VideoCallPortal = ({ localVideoRef, remoteVideoRef, handleCloseVideoCall, 
    sendSignal, action, recipientRef, startVideoStream, show }) => {
    useEffect(() => {
        const startVideo = async () => {
            console.log("Đang chạy ở video call portal")
            if (localVideoRef.current && show) {
                await startVideoStream();
                sendSignal({ type: action, recipient: recipientRef.current });
            }
        };
        startVideo();
    }, [localVideoRef, recipientRef, show]);

    return ReactDOM.createPortal(
        <Modal show={show} onHide={handleCloseVideoCall} centered>
            <Modal.Header closeButton>
                <Modal.Title>Video Call</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="video-container">
                    <video ref={localVideoRef} autoPlay muted className="local-video" />
                    <video ref={remoteVideoRef} autoPlay className='remote-video' />
                </div>
            </Modal.Body>
        </Modal>,
        document.getElementById('portal-root')
    );
};

export default VideoCallPortal;
