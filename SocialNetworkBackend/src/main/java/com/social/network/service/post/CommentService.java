package com.social.network.service.post;

import com.social.network.dto.post.CommentDTO;
import com.social.network.entity.post.Comment;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.repository.post.CommentRepo;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    CommentRepo commentRepo;
    UserService userService;
    PostService postService;

    public Comment getById(Long id) {
        return commentRepo.findById(id).orElse(null);
    }

    public CommentDTO createComment(CommentDTO request) {
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
        return new CommentDTO(comment);
    }

    public CommentDTO updateComment(Long commentId, CommentDTO request) {
        Comment existingComment = commentRepo.getById(commentId);
        existingComment.setContent(request.getContent());
        existingComment.setImageUrl(request.getImageUrl());
        existingComment.setTime(request.getTime());
        Comment updatedComment = commentRepo.save(existingComment);
        return new CommentDTO(updatedComment);
    }

    public void deleteComment(Long commentId) {
        commentRepo.deleteById(commentId);
    }

    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepo.findByPostId(postId);
        return comments.stream()
                .map(CommentDTO::new)
                .toList();
    }

    public void deleteAllCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepo.findByPostId(postId);
        commentRepo.deleteAll(comments);
    }
}




