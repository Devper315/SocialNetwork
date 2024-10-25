import React, { useContext, useState } from "react";
import "../../assets/styles/common/Login.css";
import { login } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
    const { loginSuccess } = useContext(AuthContext);

    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true); // Bắt đầu trạng thái đang đăng nhập
        setErrorMessage(''); // Xóa thông báo lỗi trước khi gửi yêu cầu
        try {
            const response = await login(form);
            const token = response.data.result.token;
            loginSuccess(token);
        } catch (error) {
            console.log(error.response)
            setErrorMessage(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false); // Hoàn thành đăng nhập, bỏ trạng thái loading
        }
    };

    return (
        <div className="home-page">
            <main className="main-content">
                <h1>Chào mừng đến với mạng xã hội của chúng tôi!</h1>
                <div className="login-form">
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <input name="username" type="text"
                        value={form.username} onChange={handleInputChange}
                        placeholder="Email hoặc số điện thoại" />
                    <input name="password" type="password"
                        value={form.password} onChange={handleInputChange}
                        placeholder="Mật khẩu" />

                    <button
                        onClick={handleSubmit}
                        className="login-button"
                        disabled={isLoading} // Vô hiệu hóa nút khi đang đăng nhập
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'} {/* Thay đổi nội dung nút */}
                    </button>
                </div>
                <div className="footer-links">
                    <a href="/register" className="register-link">Bạn chưa có tài khoản? Đăng ký ngay!</a>
                </div>
            </main>
        </div>
    );
};

export default Login;
