import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchMyNotifications, markAsRead } from '../../services/notificationService'
import logoReact from "../../assets/images/logoReact.png"
import '../../assets/styles/user/Notification.css'
import { NotificationContext } from '../../contexts/NotificationContext'
import { handleScroll } from '../../services/infiniteScroll'

const Notification = () => {
    const [notifications, setNotifications] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [lastId, setLastId] = useState(0);
    const { notificationSource } = useContext(NotificationContext)
    const navigate = useNavigate()

    const loadMoreNotifications = async () => {
        if (!hasMore) return
        const data = await fetchMyNotifications(lastId);
        setHasMore(data.length === 10)
        setNotifications([...notifications, ...data]);
        if (data.length === 10)
            setLastId(data.at(-1).id)
    };

    useEffect(() => {
        if (notificationSource) {
            loadMoreNotifications()
            notificationSource.onmessage = (message) => {
                const newNotification = JSON.parse(message.data)
                console.log(newNotification)
                setNotifications((prevNotifications) => [newNotification, ...prevNotifications])
            }
            return () => {
                notificationSource.onmessage = null
            };
        }

    }, [notificationSource])

    const toggleTab = () => {
        setIsOpen(!isOpen)
    }

    const handleClickNotification = async (notification) => {
        if (!notification.read) markAsRead(notification.id)
        toggleTab()
        navigate(notification.navigateUrl)
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
                n.id === notification.id ? { ...n, read: true } : n
            )
        )
    }

    return (
        <div>
            <li className="nav-item" onClick={toggleTab}>
                <Link to="#" className="nav-link">
                    <img src={logoReact} alt="" className="menu-logo" />
                    <span className="menu-text">Thông báo</span>
                </Link>
            </li>
            {isOpen && (
                <div className="notification-tab" onScroll={(event) => handleScroll(event, loadMoreNotifications)}>
                    <h4>Thông báo</h4>
                    {notifications.length === 0 && <p>Không có thông báo mới.</p>}
                    {notifications.length > 0 && notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleClickNotification(notification)}
                            className={`notification-item ${notification.read ? "read" : "unread"}`}>
                            <span>{notification.content}</span> <br />
                            <span>{new Date(notification.time).toLocaleString()}</span> <br />
                        </div>
                    ))}
                </div>

            )}
        </div>
    )
}

export default Notification