import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const SOCKET_URL = 'https://754e-1-54-7-90.ngrok-free.app/ws';
const CHAT_ENDPOINT = '/app/private/send';

let stompClient = null;

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
    };
};

export const connectWebSocket = (handleMessageReceived, username) => {
    const socket = new WebSocket(SOCKET_URL);
    stompClient = Stomp.over(socket);
    const headers = getHeaders();
    const chatTopic = `/user/${username}/private/reply`;
    stompClient.connect(headers, 
                        onConnectSuccess(handleMessageReceived, chatTopic), 
                        onConnectError);
};


const onConnectSuccess = (handleMessageReceived, chatTopic) => frame => {
    console.log('Connected: ' + frame);
    stompClient.subscribe(chatTopic, message => {
        if (message.body) {
            handleMessageReceived(JSON.parse(message.body));
        }
    });
};

const onConnectError = (error) => {
    console.error('WebSocket connection error:', error);
};

export const sendMessageWebSocket = (message) => {
    if (stompClient && stompClient.connected) {
        stompClient.send(CHAT_ENDPOINT, {}, JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected.');
    }
};

export const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log('Disconnected from WebSocket.');
        });
    }
};
