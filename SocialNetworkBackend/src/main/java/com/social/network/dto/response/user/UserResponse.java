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
public class UserResponse {
    Long id;
    String firstName;
    String lastName;
    String fullName;
    String username;
    String email;
    String avatarUrl;
    LocalDate dateOfBirth;
    Long role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.avatarUrl = user.getAvatarUrl();
        this.dateOfBirth = user.getDateOfBirth();
    }

    public UserResponse(User user, Long role) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.role = role;
    }
}
