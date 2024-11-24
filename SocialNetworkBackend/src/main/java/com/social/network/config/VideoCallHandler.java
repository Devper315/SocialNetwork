package com.social.network.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.Null;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class VideoCallHandler extends TextWebSocketHandler {
    private static ConcurrentMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("username");
        sessions.put(userId, session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String payload = message.getPayload();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, Object> p2pMessage = objectMapper.readValue(payload, Map.class);
            Object sender = session.getAttributes().get("username");
            System.out.println("recipient: " + p2pMessage.get("recipient"));
            WebSocketSession recipientSession = sessions.get(p2pMessage.get("recipient"));
            p2pMessage.put("sender", sender);
            p2pMessage.remove("recipient");
            String jsonResponse = objectMapper.writeValueAsString(p2pMessage);
            recipientSession.sendMessage(new TextMessage(jsonResponse));
        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = (String) session.getAttributes().get("username");
        sessions.remove(userId);
    }


}

