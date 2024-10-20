package com.social.network.service.friend;

import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.User;
import com.social.network.repository.friend.FriendshipRepo;
import com.social.network.repository.user.UserRepo;
import com.social.network.service.user.UserService;
import com.social.network.utils.UserUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendshipService {
    FriendshipRepo friendshipRepo;
    UserService userService;

    public Friendship createFriendShip (FriendRequest request){
        Friendship friendship = Friendship.builder()
                .user1(request.getRequestor())
                .user2(request.getRecipient())
                .build();
        return friendshipRepo.save(friendship);
    }

    public List<UserResponse> getMyFriends() {
        User requestor = userService.getCurrentUser();
        List<Friendship> friendships = friendshipRepo.findMyFriendships(requestor);
        return UserUtils.toUserResponse(friendships, requestor);
    }
}
