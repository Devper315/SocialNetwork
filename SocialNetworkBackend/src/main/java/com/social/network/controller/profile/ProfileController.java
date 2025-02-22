package com.social.network.controller.profile;

import com.social.network.dto.user.ProfileUpdateRequest;
import com.social.network.dto.ApiResponse;
import com.social.network.dto.user.UserDTO;
import com.social.network.service.user.ProfileService;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/profile")
public class ProfileController {
    ProfileService profileService;
    UserService userService;
    @GetMapping("/{id}")
    public ApiResponse<UserDTO> getProfile(@PathVariable Long id){
        return ApiResponse.<UserDTO>builder()
                .result(profileService.getProfileById(id))
                .build();
    }

    @PutMapping
    public ApiResponse<Boolean> updateProfile(@RequestBody ProfileUpdateRequest request){
        return ApiResponse.<Boolean>builder()
                .result(userService.updateUser(request))
                .build();
    }


}
