package com.social.network.controller.auth;


import com.social.network.dto.auth.LoginRequest;
import com.social.network.dto.user.UserDTO;
import com.social.network.dto.ApiResponse;
import com.social.network.dto.auth.LoginResponse;
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


    @PostMapping ("/register")
    public void register(@Valid @RequestBody UserDTO request){
        userService.createUser(request);
    }

    @PostMapping("/register/verify")
    public ApiResponse<Boolean> verifyEmail(@RequestParam String token){
        return ApiResponse.<Boolean>builder()
                .result(userService.verifyEmail(token))
                .build();
    }
}