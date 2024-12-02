package com.social.network.controller.post;

import com.social.network.dto.post.CommentDTO;
import com.social.network.dto.response.ApiResponse;
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
public class CommentController {
    CommentService commentService;

    @GetMapping("/{id}")
    public ApiResponse<CommentDTO> getCommentById(@PathVariable Long id) {
        CommentDTO commentResponse = new CommentDTO(commentService.getById(id));
        return ApiResponse.<CommentDTO>builder()
                .result(commentResponse)
                .build();
    }

    @GetMapping("/{postId}/comments")
    public ApiResponse<List<CommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ApiResponse.<List<CommentDTO>>builder()
                .result(comments)
                .build();
    }

    @PostMapping
    public ApiResponse<CommentDTO> createComment(@RequestBody CommentDTO request) {
        return ApiResponse.<CommentDTO>builder()
                .result(commentService.createComment(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Boolean> updateComment(@RequestBody CommentDTO request) {
        return ApiResponse.<Boolean>builder()
                .result(commentService.updateComment(request))
                .build();
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }


}
