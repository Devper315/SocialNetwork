import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../../services/authService";


const EmailVerification = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [message, setMessage] = useState("Đang xác thực email của bạn...")
    const [verify, setVerify] = useState(false)
    useEffect(() => {
        const handleVerifyEmail = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get("token");
            window.history.replaceState({}, document.title, "/register/verify");
            const verifyResult = await verifyEmail(token)
            if (verifyResult) {
                setMessage("Xác thực thành công")
                setVerify(true)
            }
            else setMessage("Link không hợp lệ hoặc đã hết hạn")
        }
        handleVerifyEmail()
    }, [])
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{message}</h2>
            {verify && <Link to="/login">Đăng nhập ngay</Link>}
        </div>
    );
}

export default EmailVerification