package com.social.network.controller.user.post;

import com.social.network.dto.request.post.PostCreateRequest;
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

    @PostMapping
    public ApiResponse<PostResponse> createPost(@RequestBody PostCreateRequest request){
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(request))
                .build();
    }
}
