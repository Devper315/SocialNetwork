package com.social.network.mapper;

import com.social.network.dto.request.user.UserCreateRequest;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    User toUser(UserCreateRequest request);
    UserResponse toUserResponse(User user);

}
