package com.social.network.controller.user.friend;

import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.friend.FriendRequestResponse;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.User;
import com.social.network.service.friend.FriendRequestService;
import com.social.network.service.friend.FriendshipService;
import com.social.network.service.notification.NotificationService;
import com.social.network.service.user.UserService;
import com.social.network.utils.UserUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/friend")
public class FriendController {
    FriendRequestService friendRequestService;
    FriendshipService friendshipService;
    UserService userService;

    @GetMapping
    public ApiResponse<List<UserResponse>> getMyFriends(
            @RequestParam int page){
        User requestor = userService.getCurrentUser();
        Page<Friendship> friendshipPage = friendshipService.getMyFriends(page, requestor);
        return ApiResponse.<List<UserResponse>>builder()
                .result(UserUtils.toUserResponse(friendshipPage.getContent(), requestor))
                .totalPages(friendshipPage.getTotalPages())
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchFriends(
            @RequestParam int page, @RequestParam String keyword){
        Page<UserResponse> userPage = userService.search(keyword, page);
        return ApiResponse.<List<UserResponse>>builder()
                .result(userPage.getContent())
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @DeleteMapping("/{friendId}")
    public ApiResponse<String> unfriend(@PathVariable Long friendId){
        return ApiResponse.<String>builder()
                .result(friendshipService.unfriend(friendId))
                .build();
    }

    @GetMapping("/request")
    public ApiResponse<List<FriendRequestResponse>> getMyFriendRequest(@RequestParam int page ){
        Page<FriendRequestResponse> resultPage = friendRequestService.getMyRequest(page);
        return ApiResponse.<List<FriendRequestResponse>>builder()
                .result(resultPage.getContent())
                .totalPages(resultPage.getTotalPages())
                .build();
    }

    @PostMapping("/request/{recipientId}")
    public ApiResponse<FriendRequest> createFriendRequest(@PathVariable Long recipientId){
        FriendRequest request = friendRequestService.createFriendRequest(recipientId);
        return ApiResponse.<FriendRequest>builder()
                .result(request)
                .build();
    }

    @DeleteMapping("/request/{requestId}")
    public ApiResponse<String> actionFriendRequestById(
            @PathVariable Long requestId, @RequestParam boolean accept){
        return ApiResponse.<String>builder()
                .result(friendRequestService.actionRequestById(requestId, accept))
                .build();
    }

    @DeleteMapping("/request")
    public ApiResponse<String> actionFriendRequestByUserId(
            @RequestParam Long userId, @RequestParam boolean accept){
        return ApiResponse.<String>builder()
                .result(friendRequestService.actionRequestByUserId(userId, accept))
                .build();
    }
}
