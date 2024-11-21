package com.social.network.entity.message;

import com.social.network.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    @Transient
    List<User> members;

    @Transient
    List<MessageCustom> messageList;

    @Enumerated
    ConversationType type;
    LocalDateTime lastUpdate;
    @Transient
    boolean isRead;
}
