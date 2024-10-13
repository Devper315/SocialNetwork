package com.social.network.entity.message;

import com.social.network.entity.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@IdClass(UserConversationId.class)
public class UserConversation {
    @Id
    @ManyToOne
    Conversation conversation;

    @Id
    @ManyToOne
    User user;
}
