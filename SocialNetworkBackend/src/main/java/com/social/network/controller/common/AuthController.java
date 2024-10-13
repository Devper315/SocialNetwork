package com.social.network.controller.common;


import com.social.network.dto.request.auth.IntrospectRequest;
import com.social.network.dto.request.auth.LoginRequest;
import com.social.network.dto.request.user.UserCreateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.auth.IntrospectResponse;
import com.social.network.dto.response.auth.LoginResponse;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.mapper.UserMapper;
import com.social.network.service.auth.AuthService;
import com.social.network.service.user.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/auth")
public class AuthController {
    AuthService authService;
    UserService userService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request){
        LoginResponse result = authService.authenticate(request);
        return ApiResponse.<LoginResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request){
        IntrospectResponse result = authService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping ("/register")
    public ApiResponse<UserResponse> register(@Valid @RequestBody UserCreateRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }
}