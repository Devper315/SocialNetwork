package com.social.network.service.post;

import com.social.network.dto.post.PostDTO;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.group.GroupRole;
import com.social.network.entity.post.Post;
import com.social.network.entity.post.PostStatus;
import com.social.network.entity.user.User;
import com.social.network.repository.post.PostRepo;
import com.social.network.service.group.GroupMemberService;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepo postRepo;
    UserService userService;
    ImageService imageService;
    GroupService groupService;
    GroupMemberService groupMemberService;
    NotificationService notificationService;

    public Post getById(Long id) {
        return postRepo.findById(id).orElse(null);
    }

    public List<PostDTO> getMyPost() {
        List<Post> posts = postRepo.findAllPost(PostStatus.APPROVED);
        return posts.stream().map(PostDTO::new).toList();
    }

    public PostDTO createPost(PostDTO request) {
        User requestor = userService.getCurrentUser();
        Post post = Post.builder()
                .content(request.getContent())
                .author(requestor)
                .createdTime(LocalDateTime.now())
                .approvalStatus(request.getApprovalStatus())
                .build();
        if (request.getGroupId() != null){
            Group group = groupService.getById(request.getGroupId());
            post.setGroup(group);
            GroupMember member = groupMemberService.getByGroupAndMember(group, requestor);
            GroupRole memberRole = member.getRole();
            if (memberRole.getLevel() >= 2){
                post.setApprovalStatus(PostStatus.APPROVED);
            }
            else post.setApprovalStatus(PostStatus.PENDING);
        }
        post = postRepo.save(post);
        return new PostDTO(post);
    }

    public PostDTO updatePost(PostDTO request) {
        Post existingPost = getById(request.getId());
        existingPost.setContent(request.getContent());
        existingPost.setApprovalStatus(request.getApprovalStatus());
        postRepo.save(existingPost);
        imageService.updatePostImages(request, existingPost);
        return new PostDTO(existingPost);
    }

    public void deletePost(Long id) {
        postRepo.deleteById(id);
    }

    public List<PostDTO> getPostsByGroup(Long groupId, PostStatus status) {
        return postRepo.findByGroupIdAndApprovalStatus(groupId, status)
                .stream().map(PostDTO::new).toList();
    }

    public void approvePost(Long postId, PostStatus approvalStatus) {
        Post post = getById(postId);
        User requestor = userService.getCurrentUser();
        if (approvalStatus.equals(PostStatus.APPROVED)){
            post.setApprovalStatus(PostStatus.APPROVED);
            post = postRepo.save(post);
            notificationService.notifyAcceptPost(requestor, post);
        }
        else {
            postRepo.delete(post);
        }
    }

    public List<PostDTO> getPostsByUserId(Long userId) {
        User user = userService.getById(userId);
        List<Post> posts = postRepo.findByAuthor(user);
        return posts.stream().map(PostDTO::new).toList();
    }
}
