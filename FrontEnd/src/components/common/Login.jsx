import React, { useContext, useState } from "react";
import { TextField, Button, CircularProgress, Typography, Box, Link as MuiLink } from "@mui/material";
import { login } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

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
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await login(form);
            const token = response.data.result.token;
            loginSuccess(token);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -20%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: 3, bgcolor: '#f5f5f5',
            }}>
            <Typography variant="h4" gutterBottom fontWeight={"bold"}>
                Chào mừng đến với mạng xã hội của chúng tôi!
            </Typography>

            <Box
                sx={{
                    maxWidth: 400, width: '100%', bgcolor: '#fff',
                    p: 4, borderRadius: 2, boxShadow: 3
                }}>
                {errorMessage && (
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                <TextField name="username" label="Tên đăng nhập" fullWidth
                    margin="normal" value={form.username} onChange={handleInputChange} />
                <TextField name="password" label="Mật khẩu" type="password" fullWidth
                    margin="normal" value={form.password} onChange={handleInputChange} />
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                    onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Đăng nhập'}
                </Button>
            </Box>

            <MuiLink component={Link} to="/register" sx={{ mt: 2 }}>
                Bạn chưa có tài khoản? Đăng ký ngay!
            </MuiLink>
        </Box>
    );
};

export default Login;
