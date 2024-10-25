package com.social.network.dto.response.post;

import com.social.network.entity.post.Comment;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long id;
    String content;
    String imageUrl;
    Long userId;
    LocalDateTime time;
    Long postId;
    String userName;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.imageUrl = comment.getImageUrl();
        this.time = comment.getTime();
        this.userId = comment.getAuthor().getId();
        this.userName = comment.getAuthor().getFullName();
        this.postId = comment.getPost().getId();

    }
}
