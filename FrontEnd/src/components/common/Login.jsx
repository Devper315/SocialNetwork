import React, { useContext, useEffect, useRef, useState } from "react"
import { TextField, Button, CircularProgress, Typography, Box, Link as MuiLink } from "@mui/material"
import { login } from "../../services/authService"
import { AuthContext } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
    const { loginSuccess } = useContext(AuthContext)
    const loginRef = useRef(null)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // useEffect(() => {
    //     loginRef.current.focus()
    // }, [])

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        setErrorMessage('')
        try {
            const response = await login(form)
            const token = response.data.result.token
            loginSuccess(token)
            navigate("/")
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{
                position: 'absolute', top: '20%', left: '20%', display: "flex",
                flexDirection: "column", alignItems: "center",
                p: 3, bgcolor: '#f5f5f5', width: "700px", borderRadius: 5
            }}>
            <Typography variant="h4" gutterBottom fontWeight={"bold"}>
                Chào mừng đến với mạng xã hội của chúng tôi!
            </Typography>

            <Box
                sx={{
                    maxWidth: 400, bgcolor: '#fff', textAlign: "center",
                    p: "0 16px 16px 16px", borderRadius: 2, boxShadow: 3, mb: 2
                }}>
                {errorMessage && (
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                <TextField name="username" label="Tên đăng nhập" fullWidth inputRef={loginRef}
                    margin="dense" value={form.username} onChange={handleInputChange} />
                <TextField name="password" label="Mật khẩu" type="password" fullWidth
                    margin="dense" value={form.password} onChange={handleInputChange} />
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                    onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Đăng nhập'}
                </Button>
            </Box>

            <MuiLink component={Link} to="/register">
                Bạn chưa có tài khoản? Đăng ký ngay!
            </MuiLink>
        </Box>
    )
}

export default Login
