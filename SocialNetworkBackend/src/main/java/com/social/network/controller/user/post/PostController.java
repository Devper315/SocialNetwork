package com.social.network.controller.user.post;

import com.social.network.dto.request.post.PostCreateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.service.post.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user/post")
public class PostController {
    PostService postService;

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
        postService.deletePost(id);
        return ApiResponse.<Void>builder().build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PostResponse> updatePost(@PathVariable Long id, @RequestBody PostUpdateRequest request) {
        request.setId(id);
        PostResponse updatedPostResponse = postService.updatePost(request);
        return ApiResponse.<PostResponse>builder()
                .result(updatedPostResponse)
                .build();
    }
}
