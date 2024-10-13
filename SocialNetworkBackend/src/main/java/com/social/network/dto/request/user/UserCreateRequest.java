package com.social.network.dto.request.user;

import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    @NotBlank(message = "Họ và tên đệm là bắt buộc")
    String firstName;

    @NotBlank(message = "Tên là bắt buộc")
    String lastName;

    @NotBlank(message = "Tên đăng nhập là bắt buộc")
    @Size(min = 3, message = "Tên đăng nhập phải có ít nhất 3 ký tự")
    String username;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    String email;

    @NotBlank(message = "Mật khẩu là bắt buộc")
    @Size(min = 3, message = "Mật khẩu phải có ít nhất 3 ký tự")
    String password;

    String avatarUrl;

    @NotNull(message = "Ngày sinh là bắt buộc")
    LocalDate dateOfBirth;
}
