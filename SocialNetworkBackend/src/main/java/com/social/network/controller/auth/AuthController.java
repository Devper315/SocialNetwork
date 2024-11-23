package com.social.network.controller.auth;


import com.social.network.dto.request.auth.IntrospectRequest;
import com.social.network.dto.request.auth.LoginRequest;
import com.social.network.dto.request.user.UserCreateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.auth.IntrospectResponse;
import com.social.network.dto.response.auth.LoginResponse;
import com.social.network.service.auth.AuthService;
import com.social.network.service.user.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

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
    public void register(@Valid @RequestBody UserCreateRequest request){
        userService.createUser(request);
    }

    @PostMapping("/register/verify")
    public ApiResponse<Boolean> verifyEmail(@RequestParam String token){
        return ApiResponse.<Boolean>builder()
                .result(userService.verifyEmail(token))
                .build();
    }
}