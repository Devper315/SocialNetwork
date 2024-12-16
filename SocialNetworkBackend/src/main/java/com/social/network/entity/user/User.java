package com.social.network.entity.user;

import com.social.network.dto.user.UserDTO;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "system_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String firstName;
    String lastName;
    String fullName;
    String username;
    String password;
    String email;
    String avatarUrl;
    LocalDate dateOfBirth;
    Boolean active;

    @ManyToMany
    List<Role> roles;

    public User (UserDTO userDTO){
        this.firstName = userDTO.getFirstName();
        this.lastName = userDTO.getLastName();
        this.username = userDTO.getUsername();
        this.email = userDTO.getEmail();
        this.password = userDTO.getPassword();
        this.dateOfBirth = userDTO.getDateOfBirth();
    }
}
