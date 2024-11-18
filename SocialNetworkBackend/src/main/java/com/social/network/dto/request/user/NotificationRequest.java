package com.social.network.dto.request.user;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String content;
    private String recipient;
    private String sender;
    private String navigateUrl;
    private boolean isRead;
    private String type;
    private Long groupId;
    private Long userId;
}
