package com.social.network.service.friend;

import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.User;
import com.social.network.repository.friend.FriendshipRepo;
import com.social.network.service.user.UserService;
import com.social.network.utils.PageableUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendshipService {
    FriendshipRepo friendshipRepo;
    UserService userService;

    public void createFriendShip (FriendRequest request){
        Friendship friendship = Friendship.builder()
                .user1(request.getRequestor())
                .user2(request.getRecipient())
                .build();
        friendshipRepo.save(friendship);
    }

    public Page<Friendship> getMyFriends(int page, User requestor) {
        Pageable pageable = PageableUtils.createPageable(page, 20);
        return friendshipRepo.findMyFriendships(requestor, pageable);
    }

    public boolean existsByUsers(User user1, User user2){
        return friendshipRepo.existsByUsers(user1, user2);
    }

    public String unfriend(Long friendId) {
        User requestor = userService.getCurrentUser();
        User friend = userService.getById(friendId);
        friendshipRepo.deleteByUsers(requestor, friend);
        return "Hủy kết bạn thành công";
    }
}
