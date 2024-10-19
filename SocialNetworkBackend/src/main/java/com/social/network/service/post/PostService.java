package com.social.network.service.post;

import com.social.network.dto.request.post.PostCreateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.entity.post.Image;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.repository.post.PostRepo;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepo postRepo;
    UserService userService;

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
        return new PostResponse(postRepo.save(post));
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

        if (request.getImageUrls() != null) {
            List<Image> imagesToRemove = existingPost.getImageList().stream()
                    .filter(image -> !request.getImageUrls().contains(image.getUrl()))
                    .collect(Collectors.toList());
            existingPost.getImageList().removeAll(imagesToRemove);
            List<Image> newImages = request.getImageUrls().stream()
                    .filter(url -> existingPost.getImageList().stream().noneMatch(image -> image.getUrl().equals(url)))
                    .map(url -> Image.builder().url(url).post(existingPost).build())
                    .collect(Collectors.toList());
            existingPost.getImageList().addAll(newImages);
        }
        return new PostResponse(postRepo.save(existingPost));
    }

    public void deletePost(Long id) {
        postRepo.deleteById(id);
    }

}
