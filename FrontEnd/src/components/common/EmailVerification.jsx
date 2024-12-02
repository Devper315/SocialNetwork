import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { verifyEmail } from "../../services/authService";
import { CircularProgress, Box, Typography, Button } from "@mui/material";

const EmailVerification = () => {
    const location = useLocation();
    const [message, setMessage] = useState("Đang xác thực email của bạn...");
    const [verify, setVerify] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleVerifyEmail = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get("token");
            window.history.replaceState({}, document.title, "/register/verify");
            try {
                const verifyResult = await verifyEmail(token);
                if (verifyResult) {
                    setMessage("🎉 Xác thực email thành công!");
                    setVerify(true);
                } else {
                    setMessage("❌ Link không hợp lệ hoặc đã hết hạn.");
                }
            } catch (error) {
                setMessage("❌ Xảy ra lỗi trong quá trình xác thực.");
            } finally {
                setLoading(false);
            }
        };
        handleVerifyEmail();
    }, [location.search]);

    return (
        <Box
            sx={{
                textAlign: "center",
                marginTop: "100px",
                padding: "20px",
            }}
        >
            {loading ? (
                <CircularProgress color="primary" />
            ) : (
                <>
                    <Typography
                        variant="h5"
                        sx={{
                            marginBottom: "20px",
                            fontWeight: "bold",
                            color: verify ? "#4caf50" : "#f44336", // Màu xanh cho thành công, đỏ cho thất bại
                        }}
                    >
                        {message}
                    </Typography>
                    {verify && (
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/"
                            sx={{
                                textTransform: "none",
                                padding: "10px 20px",
                                fontSize: "1rem",
                            }}
                        >
                            Đăng nhập ngay
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default EmailVerification;
