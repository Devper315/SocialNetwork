package com.social.network.controller.user.friend;

import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.user.FriendRequest;
import com.social.network.service.friend.FriendRequestService;
import com.social.network.service.friend.FriendshipService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/friend")
public class FriendController {
    FriendRequestService friendRequestService;
    FriendshipService friendshipService;

    @GetMapping
    public ApiResponse<List<UserResponse>> getMyFriends(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(friendshipService.getMyFriends())
                .build();
    }

    @PostMapping("/request/{recipientId}")
    public ApiResponse<FriendRequest> createFriendRequest(@PathVariable Long recipientId){
        return ApiResponse.<FriendRequest>builder()
                .result(friendRequestService.createFriendRequest(recipientId))
                .build();
    }

    @DeleteMapping("/request/{requestId}")
    public ApiResponse<String> actionFriendRequest(@PathVariable Long requestId, @RequestParam boolean accept){
        return ApiResponse.<String>builder()
                .result(friendRequestService.actionRequest(requestId, accept))
                .build();
    }
}
