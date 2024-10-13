package com.social.network.utils;


import com.social.network.dto.response.message.ConversationResponse;
import com.social.network.dto.response.message.MessageResponse;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.user.User;

import java.util.List;
import java.util.stream.Collectors;

public class ChatUtils {
    public static List<MessageResponse> convertMessageList(List<MessageCustom> messageList) {
        return messageList.stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }

    public static List<ConversationResponse> convertConversationList(
            List<Conversation> conversationList, User requestor) {
        return conversationList.stream()
                .map(conversation -> new ConversationResponse(conversation, requestor))
                .collect(Collectors.toList());
    }
}
