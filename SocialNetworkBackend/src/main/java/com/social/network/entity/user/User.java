package com.social.network.entity.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.social.network.entity.post.Image;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

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
    String username;
    String password;
    String email;

    @ManyToOne(cascade = CascadeType.ALL)
    Image avatar;
    LocalDate dateOfBirth;

    @ManyToMany
    List<Role> roles;

    public String getFullname(){
        return this.firstName + " " + this.lastName;
    }

}
