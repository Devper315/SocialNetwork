package com.social.network.controller.post;

import com.social.network.dto.request.post.PostCreateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.entity.post.Post;
import com.social.network.service.image.ImageService;
import com.social.network.service.post.CommentService;
import com.social.network.service.post.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user/post")
public class PostController {
    PostService postService;
    CommentService commentService;
    ImageService imageService;
    @GetMapping
    public ApiResponse<List<PostResponse>> getMyPost(){
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getMyPost())
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPostById(@PathVariable Long id) {
        PostResponse postResponse = new PostResponse(postService.getById(id));
        return ApiResponse.<PostResponse>builder()
                .result(postResponse)
                .build();
    }

    @PostMapping
    public ApiResponse<PostResponse> createPost(@RequestBody PostCreateRequest request){
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePost(@PathVariable Long id) {
        Post post = postService.getById(id);
        commentService.deleteAllCommentsByPostId(id);
        imageService.deleteAllImagesByPostId(post);
        postService.deletePost(id);
        return ApiResponse.<Void>builder().build();
    }


    @PutMapping("/{id}")
    public ApiResponse<PostResponse> updatePost(@PathVariable Long id, @RequestBody PostUpdateRequest request) {
        request.setId(id);
        return ApiResponse.<PostResponse>builder()
                .result(postService.updatePost(request))
                .build();
    }
    @GetMapping("/group/{groupId}")
    public ApiResponse<List<PostResponse>> getPostsByGroup(@PathVariable Long groupId) {
        List<PostResponse> posts = postService.getPostsByGroup(groupId);
        if (posts.isEmpty()) {
            return ApiResponse.<List<PostResponse>>builder()
                    .message("Không có bài viết nào cho nhóm này.")
                    .build();
        }
        return ApiResponse.<List<PostResponse>>builder()
                .result(posts)
                .build();
    }


}
