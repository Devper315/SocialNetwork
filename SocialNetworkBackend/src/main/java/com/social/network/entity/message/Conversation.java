package com.social.network.entity.message;

import com.social.network.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    // dùng cho cuộc trò chuyện nhóm
    @Transient
    List<User> memberList;

    @ManyToOne
    User user1;

    @ManyToOne
    User user2;

    @Transient
    List<MessageCustom> messageList;

    @Enumerated
    ConversationType type;
}
