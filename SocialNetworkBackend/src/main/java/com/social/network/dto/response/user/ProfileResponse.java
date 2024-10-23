package com.social.network.dto.response.user;

import com.social.network.entity.user.Role;
import com.social.network.entity.user.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileResponse {
    Long id;
    String firstName;
    String lastName;
    String fullName;
    String username;
    String email;
    String avatarUrl;
    LocalDate dateOfBirth;
    boolean myProfile;
    boolean friend;
    boolean hasFriendRequest;
    boolean sentFriendRequest;

}
