package com.social.network.service.user;

import com.social.network.dto.response.user.ProfileResponse;
import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.User;
import com.social.network.mapper.UserMapper;
import com.social.network.service.friend.FriendRequestService;
import com.social.network.service.friend.FriendshipService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {
    UserService userService;
    FriendshipService friendshipService;
    FriendRequestService friendRequestService;
    UserMapper userMapper;

    public ProfileResponse getProfileById(Long id) {
        User requestor = userService.getCurrentUser();
        User result = userService.getById(id);
        ProfileResponse response = userMapper.toProfileResponse(result);
        response.setMyProfile(requestor.getId().equals(result.getId()));
        response.setFriend(friendshipService.existsByUsers(requestor, result));
        FriendRequest requestOfResult = friendRequestService.getRequestByUsers(result, requestor);
        if (requestOfResult != null){
            response.setHasFriendRequest(true);
            response.setFriendRequestId(requestOfResult.getId());
        }
        else{
            response.setSentFriendRequest(friendRequestService.getRequestByUsers(requestor, result) != null);
        }
        return response;
    }
}
