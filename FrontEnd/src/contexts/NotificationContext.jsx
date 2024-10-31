import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { CONFIG } from "../configs/config"


export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [notificationSource, setNotificationSource] = useState(null)
    useEffect(() => {
        if (user.username) {
            console.log("Đang kết nối SSE thông báo")
            const token = localStorage.getItem("token")
            const newEventSource = new EventSource(`${CONFIG.BASE_URL}/notifications?token=${token}`)
            setNotificationSource(newEventSource)
        }
        return () => {
            if (notificationSource) {
                notificationSource.close()
                console.log("Đã ngắt kết nối SSE")
            }
        }
    }, [user])
    const PROVIDER_VALUE = { notificationSource }
    return (
        <NotificationContext.Provider value={PROVIDER_VALUE}>
            {children}
        </NotificationContext.Provider>
    )
}