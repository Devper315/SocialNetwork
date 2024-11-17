import React, { useContext, useEffect, useState } from 'react'
import './../../../assets/styles/user/message/Conversation.css'
import { Link } from 'react-router-dom'
import logoReact from "../../../assets/images/logoReact.png"
import { handleScroll } from '../../../services/infiniteScroll'
import { fetchMyConversations } from '../../../services/conversationService'
import { ChatSocketContext } from '../../../contexts/ChatSocketContext'
import { AuthContext } from '../../../contexts/AuthContext'

const Conversation = () => {
    const { user } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const {conversations, setConversations, openChatByConversation} = useContext(ChatSocketContext)
    const [lastUpdate, setLastUpdate] = useState(null)

    const toggleTab = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (user)
            loadMoreConversation()
    }, [user])

    const loadMoreConversation = async () => {
        if (!hasMore) return
        const data = await fetchMyConversations(lastUpdate)
        console.log(data)
        setHasMore(data.length === 10)
        setConversations([...conversations, ...data]);
        if (data.length === 10)
            setLastUpdate(data.at(-1).lastUpdate)
    }

    const handleClickConversation = (conversation) => {
        setIsOpen(false)
        openChatByConversation(conversation)
    }

    return (
        <div>
            <li className="nav-item" onClick={toggleTab}>
                <Link to="#" className="nav-link">
                    <img src={logoReact} alt="" className="menu-logo" />
                    <span className="menu-text">Cuộc trò chuyện</span>
                </Link>
            </li>
            {isOpen && (
                <div className='conversation-tab' onScroll={(event) => handleScroll(event, loadMoreConversation)}>
                    {conversations.length === 0 && <p>Không có cuộc trò chuyện nào.</p>}
                    {conversations.length > 0 && conversations.map(conversation => (
                        <div style={{ height: 50 }} className='conversation-item'
                            key={conversation.id}
                            onClick={() => handleClickConversation(conversation)}>
                            <span>{conversation.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Conversation