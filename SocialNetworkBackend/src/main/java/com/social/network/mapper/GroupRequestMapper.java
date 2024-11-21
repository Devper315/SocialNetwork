package com.social.network.mapper;

import com.social.network.dto.response.group.GroupRequestResponse;
import com.social.network.entity.group.GroupRequest;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface GroupRequestMapper {

    GroupRequestResponse toGroupRequestResponse(GroupRequest groupRequest);
}
