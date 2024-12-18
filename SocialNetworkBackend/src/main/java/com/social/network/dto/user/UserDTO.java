package com.social.network.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.social.network.entity.user.User;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    Long id;

    @NotBlank(message = "Họ và tên đệm là bắt buộc")
    String firstName;

    @NotBlank(message = "Tên là bắt buộc")
    String lastName;

    String fullName;

    @NotBlank(message = "Tên đăng nhập là bắt buộc")
    @Size(min = 3, message = "Tên đăng nhập phải có ít nhất 3 ký tự")
    String username;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    String email;

    @NotBlank(message = "Mật khẩu là bắt buộc")
    @Size(min = 3, message = "Mật khẩu phải có ít nhất 3 ký tự")
    String password;

    @NotNull(message = "Ngày sinh là bắt buộc")
    LocalDate dateOfBirth;

    String avatarUrl;

    Long role;

    boolean myProfile, friend, toSendRequest, hasRequest, sentRequest;


    public UserDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.avatarUrl = user.getAvatarUrl();
        this.dateOfBirth = user.getDateOfBirth();
    }

    public UserDTO(User user, Long role) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.avatarUrl = user.getAvatarUrl();
        this.dateOfBirth = user.getDateOfBirth();
        this.role = role;
    }
}
