package com.social.network.dto.response.notification;

import com.social.network.entity.notification.Notification;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    Long id;
    String content;
    String recipient;
    String sender;
    String navigateUrl;
    boolean isRead;
    LocalDateTime time;
    String type;
    Long groupId;

    public NotificationResponse(Notification notification, String senderUsername) {
        this.id = notification.getId();
        this.content = notification.getContent();
        this.recipient = notification.getRecipient();
        this.sender = senderUsername;
        this.navigateUrl = notification.getNavigateUrl();
        this.isRead = notification.isRead();
        this.time = notification.getTime();
        this.type = notification.getType();
        this.groupId = notification.getGroupId();
    }
}
