import React, { useState } from 'react';
import "../../assets/styles/common/Register.css";
import { register } from '../../services/authService';
import RegisterSuccessModal from './RegisterSuccessModal';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()
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
    const [registerError, setRegisterError] = useState('')

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
                tempErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }
        if (!form.dateOfBirth) tempErrors.dateOfBirth = 'Ngày sinh không được trống';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        setRegisterError(null)
        e.preventDefault();
        if (validateForm()) {
            try {
                await register(form)
                setSuccess(true)
            } catch (error) {
                const errorCode = error.response.status
                if (errorCode === 400) setErrors(error.response.data)
                else setRegisterError(error.response.data.message)
                console.log(error.response.data)
            }
        }
    }

    const handleNavigateLogin = () => {
        setSuccess(false)
        navigate("/")
    }

    const handleCloseModal = () => {
        setSuccess(false)
    }

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                {Object.keys(formFields).map(key => (
                    <div className="form-group" key={key}>
                        <label>{formFields[key].label}</label>
                        <input
                            type={formFields[key].type}
                            name={key}
                            value={form[key]}
                            onChange={handleChange} />
                        {errors[key] && <p className="error">{errors[key]}</p>}
                    </div>
                ))}
                {registerError && <p className="register-error">{registerError}</p>}
                <button type="submit" className="submit-btn">Đăng ký</button>
            </form>
            <RegisterSuccessModal
                show={success} registeredEmail={form.email}
                handleCloseModal={handleCloseModal} />
        </div>
    );
};

export default Register;
