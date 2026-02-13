import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { API, CONFIG } from "../configs/config"
import { fetchUnreadNotificationTotal } from "../services/notificationService"


export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [notificationSource, setNotificationSource] = useState(null)
    const [unreadTotal, setUnreadTotal] = useState(0)
    useEffect(() => {
        if (user) {
            console.log("Đang kết nối SSE thông báo")
            const token = localStorage.getItem("token")
            const newEventSource = new EventSource(`${CONFIG.BASE_URL}/notifications?token=${token}`)
            setNotificationSource(newEventSource)
            fetchUnreadNotificationTotal().then(data => {
                setUnreadTotal(data)
            })
        }
        return () => {
            if (notificationSource) {
                notificationSource.close()
                console.log("Đã ngắt kết nối SSE")
            }
        }
    }, [user])
    const PROVIDER_VALUE = { notificationSource, unreadTotal, setUnreadTotal }
    return (
        <NotificationContext.Provider value={PROVIDER_VALUE}>
            {children}
        </NotificationContext.Provider>
    )
}