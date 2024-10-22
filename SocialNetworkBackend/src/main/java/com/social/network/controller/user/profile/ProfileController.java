package com.social.network.controller.user.profile;

import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.user.ProfileResponse;
import com.social.network.service.user.ProfileService;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/profile")
public class ProfileController {
    ProfileService profileService;
    @GetMapping("/{id}")
    public ApiResponse<ProfileResponse> getProfile(@PathVariable Long id){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.getProfileById(id))
                .build();
    }
}
