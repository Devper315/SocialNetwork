package com.social.network.service.post;

import com.social.network.dto.request.post.PostCreateRequest;
import com.social.network.dto.request.post.PostUpdateRequest;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import com.social.network.repository.post.PostRepo;
import com.social.network.service.group.GroupService;
import com.social.network.service.image.ImageService;
import com.social.network.service.notification.NotificationService;
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
    ImageService imageService;
    GroupService groupService;
    NotificationService notificationService;

    public Post getById(Long id) {
        return postRepo.findById(id).orElse(null);
    }

    public List<PostResponse> getMyPost() {
        User requestor = userService.getCurrentUser();
        List<Post> posts = postRepo.findByAuthor(requestor);
        return posts.stream().map(PostResponse::new).collect(Collectors.toList());
    }

    public List<PostResponse> getApprovalPostsByGroup(Long groupId, Long approvalStatus) {
        List<Post> posts = postRepo.findByApprovalStatusAndGroupId(groupId,approvalStatus);
        return posts.stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
    }

    public PostResponse createPost(PostCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        Group group = groupService.getById(request.getGroupId());
        User receiver= userService.getById(group.getCreateUserId());
        if (group == null) {
            group = null;
        }
        Post post = Post.builder()
                .content(request.getContent())
                .author(currentUser)
                .group(group)
                .createdTime(LocalDateTime.now())
                .approvalStatus(request.getApprovalStatus())
                .build();
        post = postRepo.save(post);
        imageService.createForPost(post, request.getImageUrls());
        if(request.getApprovalStatus()==0) notificationService.sendPost(currentUser,receiver,group);
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
    public List<PostResponse> getPostsByGroup(Long groupId) {
        return postRepo.findByGroupId(groupId)
                .stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
    }

    public PostResponse updateApprovalStatus(Long postId) {
        Post post = getById(postId);
        User requestor = userService.getCurrentUser();
        User receiver = userService.getById(post.getAuthor().getId());
        Group group = groupService.getById(post.getGroup().getId());
        post.setApprovalStatus(1L);
        post = postRepo.save(post);
        notificationService.notifyAcceptPost(requestor,receiver,group);
        return new PostResponse(post);
    }

    public Long checkUser(Long postId) {
        Post post = getById(postId);
        User user = userService.getCurrentUser();
        if(post.getAuthor().equals(user)) return 1L;
        else return 0L;
    }

}
