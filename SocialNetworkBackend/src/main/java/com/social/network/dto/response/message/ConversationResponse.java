package com.social.network.dto.response.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.ConversationType;
import com.social.network.entity.user.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationResponse {

    Long id;
    String name;
    String sender;
    String recipient;
    ConversationType type;
    List<MessageResponse> messageList;

    public ConversationResponse(Conversation conversation, User requestor){
        this.id = conversation.getId();
        this.name = conversation.getName();
        this.type = conversation.getType();
        if (this.type.equals(ConversationType.PRIVATE)){
            String requestorUsername = requestor.getUsername();
            String username1 = conversation.getUser1().getUsername();
            String username2 = conversation.getUser2().getUsername();
            this.sender = requestorUsername.equals(username1) ? username1 : username2;
            this.recipient = requestorUsername.equals(username1) ? username2 : username1;
        }
    }
}
