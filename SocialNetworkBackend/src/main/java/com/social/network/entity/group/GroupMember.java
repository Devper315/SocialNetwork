package com.social.network.entity.group;

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
@IdClass(GroupMemberId.class)
public class GroupMember {
    @Id
    @ManyToOne
    Group group;

    @Id
    @ManyToOne
    User member;

    @Column(name = "group_role_id")
    Long role;
}

