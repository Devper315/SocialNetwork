package com.social.network.service.friend;

import com.social.network.dto.response.friend.FriendRequestResponse;
import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.User;
import com.social.network.mapper.FriendRequestMapper;
import com.social.network.repository.friend.FriendRequestRepo;
import com.social.network.repository.friend.FriendshipRepo;
import com.social.network.service.notification.NotificationService;
import com.social.network.service.user.UserService;
import com.social.network.utils.PageableUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendRequestService {
    FriendRequestRepo friendRequestRepo;
    UserService userService;
    FriendshipService friendshipService;
    FriendRequestMapper friendRequestMapper;
    NotificationService notificationService;

    public FriendRequest createFriendRequest(Long recipientId) {
        User recipient = userService.getById(recipientId);
        User requestor = userService.getCurrentUser();
        if (getRequestByUsers(recipient, requestor) != null) return null;
        FriendRequest request = FriendRequest.builder()
                .recipient(recipient).requestor(requestor).time(LocalDateTime.now())
                .build();
        request = friendRequestRepo.save(request);
        notificationService.notifyFriendRequest(requestor, recipient);
        return request;
    }

    public String actionRequestById(Long requestId, boolean accept) {
        FriendRequest request = getById(requestId);
        String result = "Từ chối kết bạn";
        if (accept) {
            friendshipService.createFriendShip(request);
            result = "Chấp nhận kết bạn";
        }
        friendRequestRepo.delete(request);
        return result;
    }

    public String actionRequestByUserId(Long userId, boolean accept) {
        User recipient = userService.getById(userId);
        User requestor = userService.getCurrentUser();
        FriendRequest request = getRequestByBothUsers(requestor, recipient);
        String result = "Từ chối kết bạn";
        if (accept) {
            friendshipService.createFriendShip(request);
            notificationService.notifyAcceptFriend(requestor, recipient);
            result = "Chấp nhận kết bạn";
        }
        friendRequestRepo.delete(request);
        return result;
    }

    public FriendRequest getById(Long requestId) {
        return friendRequestRepo.findById(requestId).orElseThrow();
    }

    public Page<FriendRequestResponse> getMyRequest(int page) {
        Pageable pageable = PageableUtils.createPageable(page, 20, "time");
        User requestor = userService.getCurrentUser();
        Page<FriendRequest> resultPage = friendRequestRepo.findByRecipient(requestor, pageable);
        return resultPage.map(friendRequestMapper::toFriendRequestResponse);
    }

    public FriendRequest getRequestByUsers(User requestor, User recipient){
        return friendRequestRepo.findRequestByUsers(requestor, recipient);
    }

    public FriendRequest getRequestByBothUsers(User requestor, User recipient){
        return friendRequestRepo.findRequestByBothUsers(requestor, recipient);
    }


}
