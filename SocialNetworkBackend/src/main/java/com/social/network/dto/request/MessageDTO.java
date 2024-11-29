package com.social.network.dto.request;

import com.social.network.dto.response.message.ConversationResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDTO {
    Long id;
    String sender;
    String recipient;
    String reader;
    Long conversationId;
    ConversationResponse conversation;
    String content;
    String time;
    List<String> imageUrls;
}
