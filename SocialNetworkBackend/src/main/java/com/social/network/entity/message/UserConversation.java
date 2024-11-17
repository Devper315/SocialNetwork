package com.social.network.entity.message;

import com.social.network.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class UserConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    Long conversationId;

    Long userId;
}
