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
    String email;
    String avatarUrl;
    LocalDate dateOfBirth;

    public UserResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        if (user.getAvatar() != null)
            this.avatarUrl = user.getAvatar().getUrl();
        this.dateOfBirth = user.getDateOfBirth();
    }
}
