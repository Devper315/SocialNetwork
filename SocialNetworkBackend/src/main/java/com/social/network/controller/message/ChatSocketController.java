package com.social.network.controller.message;


import com.social.network.dto.conversation.MessageDTO;
import com.social.network.service.message.ConversationService;
import com.social.network.service.message.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatSocketController {
    ConversationService conversationService;
    SimpMessagingTemplate messagingTemplate;
    MessageService messageService;


    @MessageMapping("/private/send")
    public void send(MessageDTO request) {
        messagingTemplate.convertAndSendToUser(
                request.getRecipient(),
                "/private/reply",
                request);
    }

    @MessageMapping("/mark-as-read")
    public void markAsRead(MessageDTO message){
        messageService.markAsRead(message);
        conversationService.markAsRead(message);
    }

}
