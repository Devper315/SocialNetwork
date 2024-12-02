import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const RegisterSuccessModal = ({ show, handleCloseModal, registeredEmail }) => {
    return (
        <Dialog
            open={show}
            onClose={handleCloseModal}
            aria-labelledby="register-success-dialog"
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: 4, // Bo góc nhẹ
                    overflow: "hidden",
                },
            }}
        >
            {/* Tiêu đề */}
            <DialogTitle
                id="register-success-dialog"
                sx={{
                    textAlign: "center",
                    backgroundColor: "#4caf50", // Màu xanh lá nhẹ hơn
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    padding: "16px",
                }}
            >
                Đăng ký thành công!
            </DialogTitle>

            {/* Nội dung */}
            <DialogContent
                sx={{
                    padding: "24px",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        marginBottom: "16px",
                        fontSize: "1.1rem",
                        color: "#424242", // Màu xám đậm
                    }}
                >
                    Chúng tôi đã gửi email xác nhận tới:
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#2e7d32", // Xanh lá đậm cho email
                        fontWeight: "bold",
                        wordBreak: "break-word",
                    }}
                >
                    {registeredEmail}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        marginTop: "16px",
                        fontSize: "0.95rem",
                        color: "#616161", // Màu xám trung bình
                    }}
                >
                    Vui lòng kiểm tra hộp thư đến hoặc thư mục spam để xác nhận email của bạn. 
                    Nếu không nhận được email, bạn có thể thử gửi lại sau vài phút.
                </Typography>
            </DialogContent>

            {/* Hành động */}
            <DialogActions
                sx={{
                    justifyContent: "center",
                    padding: "16px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Button
                    onClick={handleCloseModal}
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        padding: "10px 24px",
                        backgroundColor: "#4caf50",
                        "&:hover": {
                            backgroundColor: "#388e3c", // Hiệu ứng hover đậm hơn
                        },
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterSuccessModal;
