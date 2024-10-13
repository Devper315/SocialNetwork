package com.social.network.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageCreateRequest {
    String sender;
    String recipient;
    Long conversationId;
    String content;
    String time;
}
