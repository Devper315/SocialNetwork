package com.social.network.mapper;

import com.social.network.dto.response.friend.FriendRequestResponse;
import com.social.network.entity.user.FriendRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FriendRequestMapper {
    FriendRequestResponse toFriendRequestResponse(FriendRequest request);
}
