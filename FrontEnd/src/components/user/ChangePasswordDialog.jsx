import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"


const ChangePasswordDialog = ({ open, onClose }) => {
    const [password, setPassword] = useState({currentPass: '', newPass: '', confirmPass: ''})
    const [error, setError] = useState({})
    const handleSubmit = () => {
        const error = {}
        let { currentPass, newPass, confirmPass } = password
        currentPass = currentPass.trim()
        newPass = newPass.trim()
        if (!currentPass) {
            error.currentPass = "Mật khẩu hiện tại không được trống."
        }
        
        if (!newPass) error.newPass = "Mật khẩu mới không được trống"
        else if (newPass.length < 3) error.newPass = "Mật khẩu cần có có ít nhất 3 ký tự"
        else if (newPass === currentPass) error.newPass = "Mật khẩu mới không được trùng mật khẩu hiện tại"
        if (newPass !== confirmPass) error.confirmPass = "Mật khẩu xác nhận không khớp"
        setError(error)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setPassword({ ...password, [name]: value })
    }
    const buttonStyle = { textTransform: 'none', fontWeight: "bold" }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: "4px", borderBottom: "1px solid #ccc", mb: 1
            }}>
                Đổi mật khẩu
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField name="currentPass" label="Mật khẩu cũ" fullWidth type="password" required
                    value={password.currentPass} onChange={handleInputChange} margin="dense"
                    error={!!error.currentPass} helperText={error.currentPass} />

                <TextField name="newPass" label="Mật khẩu mới" fullWidth type="password" required
                    value={password.newPass} onChange={handleInputChange} margin="dense" 
                    error={!!error.newPass} helperText={error.newPass}/>

                <TextField name="confirmPass" label="Xác nhận mật khẩu mới" fullWidth type="password" required
                    value={password.confirmPass} onChange={handleInputChange} margin="dense" 
                    error={!!error.confirmPass} helperText={error.confirmPass}/>
                {error.wrongPassord &&
                    <Typography color="error">{error.wrongPassord}</Typography>}
                {password.success &&
                    <Typography color="success">{password.success}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button sx={buttonStyle} variant="contained" onClick={handleSubmit}>
                    Xác nhận
                </Button>
                <Button sx={buttonStyle} variant="outlined" onClick={onClose}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangePasswordDialog