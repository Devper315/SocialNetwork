package com.social.network.service.group;

import com.social.network.dto.group.GroupDTO;
import com.social.network.dto.group.UserGroupContext;
import com.social.network.dto.user.UserDTO;
import com.social.network.entity.group.Group;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupRepo;
import com.social.network.repository.post.PostRepo;
import com.social.network.repository.user.UserRepo;
import com.social.network.service.user.UserService;
import com.social.network.utils.PageableUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupService {
    GroupRepo groupRepo;
    UserService userService;
    GroupMemberService groupMemberService;
    PostRepo postRepo;


    public Group createGroup(GroupDTO request) {
        User user = userService.getCurrentUser();
        Group group = Group.builder()
                .name(request.getName()).imageUrl(request.getImageUrl())
                .createUserId(user.getId()).description(request.getDescription())
                .createTime(LocalDateTime.now())
                .build();
        group = groupRepo.save(group);
        groupMemberService.addGroupMember(group, user, "OWNER");
        return group;
    }

    public boolean addGroupMember(Long groupId, Long userId) {
        User user = userService.getById(userId);
        Group group = getById(groupId);
        return groupMemberService.addGroupMember(group, user, "MEMBER");
    }

    public boolean removeGroupMember(Long groupId, Long userId) {
        User user = userService.getById(userId);
        Group group = getById(groupId);
        return groupMemberService.removeGroupMember(group, user);
    }

    public boolean leaveGroup(Long groupId) {
        User user = userService.getCurrentUser();
        Group group = getById(groupId);
        return groupMemberService.removeGroupMember(group, user);
    }

    public Group getById(Long id) {
        return groupRepo.findById(id).orElse(null);
    }

    public Group updateGroup(GroupDTO request) {
        Group group = getById(request.getId());
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setImageUrl(request.getImageUrl());
        return groupRepo.save(group);
    }

    public Page<Group> search(String keyword, int page, int size) {
        Pageable pageable = PageableUtils.createPageable(page, size, "name");
        return groupRepo.search(keyword, pageable);
    }

    public Page<Group> searchMyGroups(String keyword, int page, int size) {
        User requestor = userService.getCurrentUser();
        Pageable pageable = PageableUtils.createPageable(page, size, "name");
        return groupRepo.searchMyGroups(requestor.getId(), keyword, pageable);
    }

    public List<UserDTO> getMembersByGroupId(Long groupId) {
        Group group = getById(groupId);
        return groupMemberService.getByGroup(group);
    }

    public boolean changeOwner(Long groupId, Long newOwnerId) {
        Group group = getById(groupId);
        changeMemberRole(groupId, group.getCreateUserId(), "MEMBER");
        changeMemberRole(groupId, newOwnerId, "OWNER");
        return true;
    }

    public boolean changeMemberRole(Long groupId, Long userId, String newRole) {
        Group group = getById(groupId);
        User user = userService.getById(userId);
        return groupMemberService.changeMemberRole(group, user, newRole);
    }

    public boolean dissolveGroup(Long groupId) {
        Group group = getById(groupId);
        groupMemberService.removeAllGroupMembers(group);
        postRepo.deleteByGroupId(groupId);
        groupRepo.delete(group);
        return true;
    }


}
