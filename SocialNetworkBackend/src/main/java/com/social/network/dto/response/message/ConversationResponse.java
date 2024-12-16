package com.social.network.dto.response.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.ConversationType;
import com.social.network.entity.user.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
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
    List<MemberDTO> members;
    ConversationType type;
    LocalDateTime lastUpdate;
    boolean isRead;

    public ConversationResponse(Conversation conversation, List<User> members, User requestor){
        this.id = conversation.getId();
        this.name = conversation.getName();
        this.type = conversation.getType();
        if (this.type.equals(ConversationType.PRIVATE)){
            String requestorUsername = requestor.getUsername();
            User member1 = members.get(0);
            User member2 = members.get(1);
            String username1 = member1.getUsername();
            String fullname1 = member1.getFullName();
            String username2 = member2.getUsername();
            String fullname2 = member2.getFullName();
            this.sender = requestorUsername.equals(username1) ? username1 : username2;
            this.recipient = requestorUsername.equals(username1) ? username2 : username1;
            this.name = requestorUsername.equals(username1) ? fullname2 : fullname1;
        }
        else {
            this.members = members.stream().map(MemberDTO::new).toList();
        }
        this.isRead = conversation.isRead();
        this.lastUpdate = conversation.getLastUpdate();
    }
}
