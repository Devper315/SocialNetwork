import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const navigate = useNavigate()

    // chạy khi truy cập trang web và có sẵn token
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            getInfoFromToken(token)
        }
    }, [])

    // được gọi từ component Login khi đăng nhập thành công
    const loginSuccess = (token) => {
        localStorage.setItem("token", token)
        getInfoFromToken(token)
    }

    const getInfoFromToken = async (token) => {
        const payload = jwtDecode(token)
        const claim = payload.customClaim
        let loggedInUser = {
            id: claim.id,
            fullName: claim.fullName,
            username: claim.username,
        }
        console.log("loggedInUser", loggedInUser)
        setUser(loggedInUser)
        setIsLoggedIn(true)
    }

    const logout = () => {
        setIsLoggedIn(false)
        setUser({})
        localStorage.removeItem("token")
        navigate("/")
    }

    const PROVIDER_VALUE = {isLoggedIn, user, setUser, loginSuccess, logout}
    return (
        <AuthContext.Provider value={PROVIDER_VALUE}>
            {children}
        </AuthContext.Provider>
    )

}