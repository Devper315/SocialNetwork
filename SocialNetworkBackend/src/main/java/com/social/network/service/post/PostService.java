package com.social.network.service.post;

import com.social.network.dto.request.post.PostCreateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.entity.post.Image;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.repository.post.PostRepo;
import com.social.network.service.message.ImageService;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepo postRepo;
    UserService userService;
    ImageService imageService;

    public Post getById(Long id){
        return postRepo.findById(id).orElse(null);
    }


    public List<PostResponse> getMyPost(){
        User requestor = userService.getCurrentUser();
        List<Post> posts = postRepo.findByAuthor(requestor);
        return posts.stream().map(PostResponse::new).collect(Collectors.toList());
    }

    public PostResponse createPost(PostCreateRequest request) {
        Post post = Post.builder()
                .content(request.getContent())
                .author(userService.getCurrentUser())
                .createdTime(LocalDateTime.now())
                .build();
        post = postRepo.save(post);
        imageService.createForPost(post, request.getImageUrls());
        return new PostResponse(post);
    }

    public PostResponse updatePost(PostUpdateRequest request) {
        Post existingPost = getById(request.getId());
        if (existingPost == null) {
            throw new RuntimeException("Bài viết không tìm thấy");
        }
        existingPost.setContent(request.getContent());
        if (request.getStatus() != null) {
            existingPost.setStatus(request.getStatus());
        }
        postRepo.save(existingPost);
        imageService.updatePostImages(request.getImageUrls(), existingPost);
        return new PostResponse(existingPost);
    }


    public void deletePost(Long id) {
        postRepo.deleteById(id);
    }

}
