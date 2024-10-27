package com.social.network.controller.user.post;

import com.social.network.dto.request.post.CommentCreateRequest;
import com.social.network.dto.request.post.CommentUpdateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.post.CommentResponse;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.service.post.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user/post/comments")
public class CommentController
{
    CommentService commentService;

    @GetMapping("/{id}")
    public ApiResponse<CommentResponse> getCommentById(@PathVariable Long id) {
        CommentResponse commentResponse = new CommentResponse(commentService.getById(id));
        return ApiResponse.<CommentResponse>builder()
                .result(commentResponse)
                .build();
    }

    @GetMapping("/{postId}/comments")
    public ApiResponse<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ApiResponse.<List<CommentResponse>>builder()
                .result(comments)
                .build();
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@RequestBody CommentCreateRequest request) {
        CommentResponse commentResponse = commentService.createComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentResponse);
    }

    @PutMapping("/{id}")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable Long id,
            @RequestBody CommentUpdateRequest request) {
        CommentResponse updatedComment = commentService.updateComment(id, request);
        return ApiResponse.<CommentResponse>builder()
                .result(updatedComment)
                .message("Cập nhật bình luận thành công")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ApiResponse.<Void>builder().build();
    }

}
