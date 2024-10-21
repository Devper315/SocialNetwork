import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const IncomingCallPortal = ({ incoming, callFrom, handleAcceptCall, handleRejectCall }) => {

    return ReactDOM.createPortal(
        <Modal show={incoming} centered>
            <Modal.Header>
                <Modal.Title>Cuộc gọi đến</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{callFrom} đang gọi cho bạn</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => handleAcceptCall(callFrom)}>
                    Chấp nhận
                </Button>
                <Button variant="danger" onClick={() => handleRejectCall()}>
                    Từ chối
                </Button>
            </Modal.Footer>
        </Modal>,
        document.getElementById('portal-root')
    );
};

export default IncomingCallPortal;
