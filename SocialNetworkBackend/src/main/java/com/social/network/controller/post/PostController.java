package com.social.network.controller.post;

import com.social.network.dto.post.PostDTO;
import com.social.network.dto.ApiResponse;
import com.social.network.entity.post.Post;
import com.social.network.entity.post.PostStatus;
import com.social.network.service.image.ImageService;
import com.social.network.service.post.CommentService;
import com.social.network.service.post.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/post")
public class PostController {
    PostService postService;
    CommentService commentService;
    ImageService imageService;
    @GetMapping
    public ApiResponse<List<PostDTO>> getMyPost(){
        return ApiResponse.<List<PostDTO>>builder()
                .result(postService.getMyPost())
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<PostDTO> getPostById(@PathVariable Long id) {
        PostDTO postResponse = new PostDTO(postService.getById(id));
        return ApiResponse.<PostDTO>builder()
                .result(postResponse)
                .build();
    }

    @PostMapping
    public ApiResponse<PostDTO> createPost(@RequestBody PostDTO request){
        return ApiResponse.<PostDTO>builder()
                .result(postService.createPost(request))
                .build();
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        Post post = postService.getById(id);
        commentService.deleteAllCommentsByPostId(id);
        imageService.deleteAllImagesByPostId(post);
        postService.deletePost(id);
    }


    @PutMapping
    public ApiResponse<PostDTO> updatePost(@RequestBody PostDTO request) {
        return ApiResponse.<PostDTO>builder()
                .result(postService.updatePost(request))
                .build();
    }
    @GetMapping("/group")
    public ApiResponse<List<PostDTO>> getPostsByGroup(
            @RequestParam Long groupId, @RequestParam PostStatus status) {
        return ApiResponse.<List<PostDTO>>builder()
                .result(postService.getPostsByGroup(groupId, status))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<PostDTO>> getPostsByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<PostDTO>>builder()
                .result(postService.getPostsByUserId(userId))
                .build();
    }

    @PatchMapping("/approve")
    public void approvePost(@RequestParam Long postId, @RequestParam PostStatus approvalStatus) {
        postService.approvePost(postId, approvalStatus);
    }

}
