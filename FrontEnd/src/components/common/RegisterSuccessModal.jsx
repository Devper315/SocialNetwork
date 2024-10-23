import React from "react";
import { Button, Modal } from "react-bootstrap";


const RegisterSuccessModal = ({show, handleCloseModal, handleNavigateLogin}) => {
    return (
        <Modal show={show} centered>
            <Modal.Header>
                <Modal.Title>Đăng ký thành công</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button onClick={handleNavigateLogin}>Đăng nhập ngay</Button>
                <Button variant="secondary" onClick={() => handleCloseModal}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RegisterSuccessModal