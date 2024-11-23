package com.social.network.controller.profile;

import com.social.network.dto.request.user.ProfileUpdateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.user.ProfileResponse;
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
    public ApiResponse<ProfileResponse> getProfile(@PathVariable Long id){
        return ApiResponse.<ProfileResponse>builder()
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
