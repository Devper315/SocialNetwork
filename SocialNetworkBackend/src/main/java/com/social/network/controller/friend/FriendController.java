package com.social.network.controller.friend;

import com.social.network.dto.user.UserDTO;
import com.social.network.dto.ApiResponse;
import com.social.network.entity.user.FriendRequest;
import com.social.network.service.friend.FriendRequestService;
import com.social.network.service.friend.FriendshipService;
import com.social.network.service.user.UserService;
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
    public ApiResponse<List<UserDTO>> getMyFriends(@RequestParam int page, @RequestParam int size){
        return friendshipService.getMyFriends(page, size);
    }

    @GetMapping("/search")
    public ApiResponse<List<UserDTO>> searchFriends(
             @RequestParam String keyword, @RequestParam int page, @RequestParam int size){
        Page<UserDTO> userPage = userService.search(keyword, page, size);
        return ApiResponse.<List<UserDTO>>builder()
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
    public ApiResponse<List<UserDTO>> getMyFriendRequest(
            @RequestParam int page, @RequestParam int size ){
        return friendRequestService.getMyRequest(page, size);
    }

    @PostMapping("/request/{recipientId}")
    public ApiResponse<FriendRequest> createFriendRequest(@PathVariable Long recipientId){
        FriendRequest request = friendRequestService.createFriendRequest(recipientId);
        return ApiResponse.<FriendRequest>builder()
                .result(request)
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
