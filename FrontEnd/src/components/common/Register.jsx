import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Modal } from '@mui/material';
import { register } from '../../services/authService';
import RegisterSuccessModal from './RegisterSuccessModal';

const Register = () => {
    const [success, setSuccess] = useState(false);
    const formFields = {
        firstName: { label: 'Họ và tên đệm', type: 'text' },
        lastName: { label: 'Tên', type: 'text' },
        username: { label: 'Tên đăng nhập', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Mật khẩu', type: 'password' },
        confirmPassword: { label: 'Xác nhận mật khẩu', type: 'password' },
        dateOfBirth: { label: 'Ngày sinh', type: 'date' }
    };

    const [form, setForm] = useState(
        Object.keys(formFields).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {})
    );
    const [errors, setErrors] = useState({});
    const [registerError, setRegisterError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!form.firstName) tempErrors.firstName = 'Họ và tên đệm không được trống';
        if (!form.lastName) tempErrors.lastName = 'Tên không được trống';
        if (!form.username || form.username.length < 3)
            tempErrors.username = 'Tên đăng nhập có độ dài tối thiểu là 3';
        if (!form.email) {
            tempErrors.email = 'Email không được trống';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            tempErrors.email = 'Email không hợp lệ';
        }
        if (!form.password || form.password.length < 3)
            tempErrors.password = 'Mật khẩu có độ dài tối thiểu là 3';
        else {
            if (form.password !== form.confirmPassword)
                tempErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        if (!form.dateOfBirth) tempErrors.dateOfBirth = 'Ngày sinh không được trống';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        setRegisterError(null);
        e.preventDefault();
        if (validateForm()) {
            try {
                await register(form);
                setSuccess(true);
            } catch (error) {
                const errorCode = error.response.status;
                if (errorCode === 400) setErrors(error.response.data);
                else setRegisterError(error.response.data.message);
                console.log(error.response.data);
            }
        }
    };

    const handleCloseModal = () => {
        setSuccess(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                padding: 3,
                bgcolor: '#f5f5f5',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Đăng ký tài khoản mới
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    bgcolor: '#fff',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Grid container spacing={2}>
                    {Object.keys(formFields).map((key) => (
                        <Grid item xs={12} sm={key === 'dateOfBirth' ? 12 : 6} key={key}>
                            <TextField
                                label={formFields[key].label}
                                type={formFields[key].type}
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors[key]}
                                helperText={errors[key]}
                                InputLabelProps={formFields[key].type === 'date' && {
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
                {registerError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {registerError}
                    </Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Đăng ký
                </Button>
            </Box>

            <RegisterSuccessModal
                show={success} registeredEmail={form.email}
                handleCloseModal={handleCloseModal} />
        </Box>
    );
};

export default Register;
