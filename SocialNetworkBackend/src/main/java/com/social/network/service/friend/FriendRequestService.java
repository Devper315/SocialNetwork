package com.social.network.service.friend;

import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.User;
import com.social.network.repository.friend.FriendRequestRepo;
import com.social.network.repository.friend.FriendshipRepo;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendRequestService {
    FriendRequestRepo friendRequestRepo;
    UserService userService;
    FriendshipService friendshipService;

    public FriendRequest createFriendRequest(Long recipientId) {
        User recipient = userService.getById(recipientId);
        User requestor = userService.getCurrentUser();
        if (friendRequestRepo.existsFriendRequest(recipient, requestor)) return null;
        FriendRequest request = FriendRequest.builder()
                .recipient(recipient)
                .requestor(requestor)
                .build();
        return friendRequestRepo.save(request);
    }

    public String actionRequest(Long requestId, boolean accept) {
        FriendRequest request = getById(requestId);
        if (accept) {
            friendshipService.createFriendShip(request);
            return "Chấp nhận kết bạn";
        }
        else friendRequestRepo.delete(request);
        return "Từ chối kết bạn";
    }

    public FriendRequest getById(Long requestId) {
        return friendRequestRepo.findById(requestId).orElseThrow();
    }
}
