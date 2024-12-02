package com.social.network.service.post;

import com.social.network.dto.post.PostDTO;
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

    public List<PostDTO> getMyPost() {
        User requestor = userService.getCurrentUser();
        List<Post> posts = postRepo.findAll();
        return posts.stream().map(PostDTO::new).toList();
    }

    public List<PostDTO> getApprovalPostsByGroup(Long groupId, Long approvalStatus) {
        List<Post> posts = postRepo.findByApprovalStatusAndGroupId(groupId, approvalStatus);
        return posts.stream().map(PostDTO::new).toList();
    }

    public PostDTO createPost(PostDTO request) {
        User currentUser = userService.getCurrentUser();
//        Group group = groupService.getById(request.getGroupId());
//        User receiver = userService.getById(group.getCreateUserId());
        Post post = Post.builder()
                .content(request.getContent())
                .author(currentUser)
//                .group(group)
                .createdTime(LocalDateTime.now())
                .approvalStatus(request.getApprovalStatus())
                .build();
        post = postRepo.save(post);
//        if (request.getApprovalStatus() == 0) notificationService.sendPost(currentUser, receiver, group);
        return new PostDTO(post);
    }

    public PostDTO updatePost(PostDTO request) {
        Post existingPost = getById(request.getId());
        existingPost.setContent(request.getContent());
        postRepo.save(existingPost);
        imageService.updatePostImages(request, existingPost);
        return new PostDTO(existingPost);
    }

    public void deletePost(Long id) {
        postRepo.deleteById(id);
    }

    public List<PostDTO> getPostsByGroup(Long groupId) {
        return postRepo.findByGroupId(groupId)
                .stream().map(PostDTO::new).toList();
    }

    public PostDTO updateApprovalStatus(Long postId) {
        Post post = getById(postId);
        User requestor = userService.getCurrentUser();
        User receiver = userService.getById(post.getAuthor().getId());
        Group group = groupService.getById(post.getGroup().getId());
        post.setApprovalStatus(1L);
        post = postRepo.save(post);
        notificationService.notifyAcceptPost(requestor, receiver, group);
        return new PostDTO(post);
    }

    public Long checkUser(Long postId) {
        Post post = getById(postId);
        User user = userService.getCurrentUser();
        if (post.getAuthor().equals(user)) return 1L;
        else return 0L;
    }

}
