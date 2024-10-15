import React, { useContext } from 'react';
// import "../../assets/styles/common/HomePage.css";
import { AuthContext } from '../../contexts/AuthContext';
import Login from './Login';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)

  return (
    <div>
      {!isLoggedIn && <Login />}
      {isLoggedIn && 
      <>
      <h3>Bạn đã đăng nhập</h3>
      <button onClick={() => logout()}>Đăng xuất</button>
      </>}
    </div>
  );
};

export default HomePage;
