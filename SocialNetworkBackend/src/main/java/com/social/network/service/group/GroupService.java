package com.social.network.service.group;

import com.social.network.dto.group.GroupDTO;
import com.social.network.dto.user.UserDTO;
import com.social.network.entity.group.Group;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupRepo;
import com.social.network.repository.post.PostRepo;
import com.social.network.repository.user.UserRepo;
import com.social.network.service.user.UserService;
import com.social.network.utils.PageableUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
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
    UserRepo userRepo;
    PostRepo postRepo;


    public Group createGroup(GroupDTO request) {
        User user = userService.getCurrentUser();
        Group group = Group.builder()
                .name(request.getName()).imageUrl(request.getImageUrl())
                .createUserId(user.getId())
                .createTime(LocalDateTime.now())
                .build();
        group = groupRepo.save(group);
        groupMemberService.addGroupMember(group, user, 1L);
        return group;
    }

    public boolean addGroupMember(Long groupId, Long userId){
        User user = userService.getById(userId);
        Group group = getById(groupId);
        return groupMemberService.addGroupMember(group, user, 3L);
    }

    public boolean removeGroupMember(Long groupId, Long userId){
        User user = userService.getById(userId);
        Group group = getById(groupId);
        groupMemberService.changeMemberRole(group, user, null);
        return groupMemberService.removeGroupMember(group, user);
    }

    public boolean leaveGroup(Long groupId){
        User user = userService.getCurrentUser();
        Group group = getById(groupId);
        groupMemberService.changeMemberRole(group, user, null);
        return groupMemberService.removeGroupMember(group, user);
    }

    public Group getById(Long id){
        Group group = groupRepo.findById(id).orElse(null);
        User user = userService.getCurrentUser();
        assert group != null;
        group.setJoined(groupMemberService.existsByGroupAndMember(group, user));
        return group;
    }

    public Group updateGroup(GroupDTO request){
        Group group = groupRepo.findById(request.getId()).orElse(null);
        assert group != null;
        group.setName(request.getName());
        group.setImageUrl(request.getImageUrl());
        return groupRepo.save(group);
    }

    public Page<Group> search(String keyword, int page, int size) {
        Pageable pageable = PageableUtils.createPageable(page, size, "name");
        return groupRepo.search(keyword, pageable);
    }

    public Page<Group> searchMyGroups(String keyword, int page, int size) {
        User requestor = userService.getCurrentUser();
        Pageable pageable = PageableUtils.createPageable(page, 10, "name");
        return groupRepo.searchMyGroups(requestor.getId(), keyword, pageable);
    }

    public List<UserDTO> getMembersByGroupId(Long groupId) {
        Group group = getById(groupId);
        return groupMemberService.getByGroup(group);
    }

    public Long checkUser(Long groupId) {
        Group group = groupRepo.findById(groupId).orElse(null);
        User currentUser = userService.getCurrentUser();
        return groupMemberService.getUserRoleInGroup(group, currentUser);
    }

    public boolean changeMemberRole(Long groupId, Long userId, Long newRoleId) {
        Group group = groupRepo.findById(groupId).orElse(null);
        User user = userRepo.findById(userId).orElse(null);
        return groupMemberService.changeMemberRole(group, user, newRoleId);
    }

    public Long getUserRoleInGroup(Long groupId, Long userId) {
        Group group = getById(groupId);
        User user = userRepo.findById(userId).orElse(null);
        return groupMemberService.getUserRoleInGroup(group, user);
    }

    public boolean changeCreateUserId(Long groupId,Long userId){
        Group group = getById(groupId);
        User user = userRepo.findById(userId).orElse(null);
        User createUser= userService.getById(group.getCreateUserId());
        groupMemberService.changeMemberRole(group,createUser,3L);
        groupMemberService.changeCreateUserId(group,user);

        return true;
    }

    @Transactional
    @Modifying
    public boolean dissolveGroup(Long groupId) {
        Group group = getById(groupId);
        groupMemberService.removeAllGroupMembers(group);
        postRepo.deleteByGroupId(groupId);
        groupRepo.delete(group);
        return true;
    }
}
