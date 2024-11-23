import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const RegisterSuccessModal = ({ show, handleCloseModal, registeredEmail }) => {
    return (
        <Dialog open={show} onClose={handleCloseModal}
            aria-labelledby="register-success-dialog" fullWidth maxWidth="sm">
            <DialogTitle id="register-success-dialog"
                sx={{ textAlign: "center", backgroundColor: "#1976d2", color: "#fff" }}>
                Xác nhận email
            </DialogTitle>
            <DialogContent sx={{ padding: "24px", textAlign: "center" }}>
                <Typography variant="body1" sx={{ marginBottom: "16px", fontSize: "1.1rem" }}>
                    Chúng tôi đã gửi email xác nhận tới:
                </Typography>
                <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "bold", wordBreak: "break-word" }}>
                    {registeredEmail}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: "16px", fontSize: "0.9rem" }}>
                    Vui lòng kiểm tra hộp thư đến hoặc hộp thư spam để xác nhận email của bạn.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
                <Button onClick={handleCloseModal} variant="contained" color="primary"
                        sx={{ textTransform: "none", padding: "8px 24px" }}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterSuccessModal;
