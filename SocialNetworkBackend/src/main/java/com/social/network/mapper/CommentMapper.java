package com.social.network.mapper;

import com.social.network.dto.request.post.CommentCreateRequest;
import com.social.network.dto.response.post.CommentResponse;
import com.social.network.entity.post.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(source = "author.id", target = "userId")
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "author.fullName", target = "userName")
    CommentResponse toResponse(Comment comment);
    Comment toEntity(CommentCreateRequest request);
}
