package com.social.network.service.user;

import com.social.network.dto.user.UserDTO;
import com.social.network.entity.user.User;
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

    public UserDTO getProfileById(Long id) {
        User requestor = userService.getCurrentUser();
        User user = userService.getById(id);
        UserDTO response = new UserDTO(user);
        boolean myProfile, friend, toSendRequest, hasRequest, sentRequest;
        myProfile = requestor.getId().equals(user.getId());
        friend = friendshipService.existsByUsers(requestor, user);
        hasRequest = friendRequestService.getRequestByUsers(user, requestor) != null;
        sentRequest = friendRequestService.getRequestByUsers(requestor, user) != null;
        toSendRequest = !myProfile && !friend && ! hasRequest && ! sentRequest;
        response.setMyProfile(myProfile);
        response.setFriend(friend);
        response.setHasRequest(hasRequest);
        response.setToSendRequest(toSendRequest);
        response.setSentRequest(sentRequest);
        return response;
    }

}
