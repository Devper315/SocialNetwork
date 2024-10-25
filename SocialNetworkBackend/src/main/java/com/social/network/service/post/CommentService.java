package com.social.network.service.post;

import com.social.network.dto.request.post.CommentCreateRequest;
import com.social.network.dto.request.post.CommentUpdateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.post.CommentResponse;
import com.social.network.entity.post.Comment;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.mapper.CommentMapper;
import com.social.network.repository.post.CommentRepo;
import com.social.network.repository.post.PostRepo;
import com.social.network.service.message.ImageService;
import com.social.network.service.user.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepo commentRepo;

    @Autowired
    UserService userService;

    PostService postService;
    CommentMapper commentMapper;


    public Comment getById(Long id) {
        return commentRepo.findById(id).orElse(null);
    }


    public CommentResponse createComment(CommentCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postService.getById(request.getPostId());

        Comment comment = Comment.builder()
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .author(currentUser)
                .post(post)
                .time(LocalDateTime.now())
                .build();

        comment = commentRepo.save(comment);
        return commentMapper.toResponse(comment);
    }

    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        Comment existingComment = commentRepo.getById(commentId);
        existingComment.setContent(request.getContent());
        existingComment.setImageUrl(request.getImageUrl());
        existingComment.setTime(request.getTime());
        Comment updatedComment = commentRepo.save(existingComment);
        return commentMapper.toResponse(updatedComment);
    }

    public void deleteComment(Long commentId) {
        commentRepo.deleteById(commentId);

    }

}




