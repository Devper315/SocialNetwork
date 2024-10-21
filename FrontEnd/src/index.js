import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { ChatSocketProvider } from './contexts/ChatSocketContext';
import { VideoCallProvider } from './contexts/VideoCallSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <AuthProvider>
            {/* <ChatSocketProvider> */}
                {/* <VideoCallProvider> */}
                    <App />
                {/* </VideoCallProvider> */}
            {/* </ChatSocketProvider> */}
        </AuthProvider>
    </BrowserRouter>
);

