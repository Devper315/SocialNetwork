import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../../assets/styles/common/Header.css"
import logoReact from "../../assets/images/logoReact.png"
import Notification from "../user/Notification";
const Header = () => {
    const { user } = useContext(AuthContext)
    
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary">
                <div className="container-fluid">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <img src={logoReact} alt="" className="menu-logo" />
                                <span className="menu-text">Trang chủ</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/friends" className="nav-link">
                                <img src={logoReact} alt="" className="menu-logo" />
                                <span className="menu-text">Bạn bè</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/group" className="nav-link">
                                <img src={logoReact} alt="" className="menu-logo" />
                                <span className="menu-text">Nhóm</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/messages" className="nav-link">
                                <img src={logoReact} alt="" className="menu-logo" />
                                <span className="menu-text">Tin nhắn</span>
                            </Link>
                        </li>
                        <Notification/>
                        <li className="nav-item">
                            <Link to={`/profile/${user.id}`} className="nav-link">
                                <img src={logoReact} alt="" className="menu-logo" />
                                <span className="menu-text">Trang cá nhân</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/post-list" className="nav-link">
                                <img src={logoReact} alt="" className="menu-logo" />
                                <span className="menu-text">Post</span>
                            </Link>
                        </li>

                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;