package com.social.network.controller.user;


import com.social.network.dto.request.MessageCreateRequest;
import com.social.network.service.message.ConversationService;
import com.social.network.service.message.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatSocketController {
    ConversationService conversationService;
    SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message")
    @SendTo("/topic/messages")
    public String sendMessage(String message) {
        return message;
    }

    @MessageMapping("/private/send")
    public void send(MessageCreateRequest request) {
        conversationService.createMessage(request);
        messagingTemplate.convertAndSendToUser(
                request.getRecipient(),
                "/private/reply",
                request);
    }


}
