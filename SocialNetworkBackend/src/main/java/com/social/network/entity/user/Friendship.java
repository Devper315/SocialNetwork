package com.social.network.entity.user;

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
@IdClass(FriendshipId.class)
public class Friendship {
    @Id
    @ManyToOne
    User user1;

    @Id
    @ManyToOne
    User user2;
}
