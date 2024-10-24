package com.social.network.utils;

import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.User;
import java.util.List;
import java.util.stream.Collectors;

public class UserUtils {
    public static List<UserResponse> toUserResponse(List<User> users) {
        return users.stream().map(UserResponse::new).collect(Collectors.toList());
    }

    public static List<UserResponse> toUserResponse(List<Friendship> friendships, User requestor) {
        return friendships.stream().map(friendship -> {
            User friend = requestor.getId().equals(friendship.getUser1().getId())
                          ? friendship.getUser2()
                          : friendship.getUser1();
          return new UserResponse(friend);
        }).collect(Collectors.toList());
    }
}
