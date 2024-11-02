package com.social.network.entity.group;

import com.social.network.entity.user.FriendshipId;
import com.social.network.entity.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.lang.reflect.Member;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@IdClass(GroupMemberId.class)
public class GroupMember {
    @Id
    @ManyToOne
    Group group;

    @Id
    @ManyToOne
    User member;

    @ManyToOne
    GroupRole groupRole;
}
