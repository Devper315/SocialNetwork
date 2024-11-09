package com.social.network.service.group;

import com.social.network.dto.request.group.GroupRequest;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupRepo;
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

    public Group createGroup(GroupRequest request) {
        User user = userService.getCurrentUser();
        Group group = Group.builder()
                .name(request.getName()).imageUrl(request.getImageUrl())
                .createUserId(user.getId())
                .createTime(LocalDateTime.now())
                .build();
        group = groupRepo.save(group);
        groupMemberService.addGroupMember(group, user);
        return group;
    }

    public boolean addGroupMember(Long groupId, Long userId){
        User user = userService.getById(userId);
        Group group = getById(groupId);
        return groupMemberService.addGroupMember(group, user);
    }

    public boolean removeGroupMember(Long groupId, Long userId){
        User user = userService.getById(userId);
        Group group = getById(groupId);
        return groupMemberService.removeGroupMember(group, user);
    }

    public Group getById(Long id){
        Group group = groupRepo.findById(id).orElse(null);
        User user = userService.getCurrentUser();
        assert group != null;
        group.setJoined(groupMemberService.existsByGroupAndMember(group, user));
        return group;
    }

    public Group updateGroup(GroupRequest request){
        Group group = groupRepo.findById(request.getId()).orElse(null);
        assert group != null;
        group.setName(request.getName());
        group.setImageUrl(request.getImageUrl());
        return groupRepo.save(group);
    }

    public Page<Group> search(String keyword, int page) {
        Pageable pageable = PageableUtils.createPageable(page, 10, "name");
        return groupRepo.search(keyword, pageable);
    }

    public Page<Group> searchMyGroups(String keyword, int page) {
        User requestor = userService.getCurrentUser();
        Pageable pageable = PageableUtils.createPageable(page, 10, "name");
        return groupRepo.searchMyGroups(requestor.getId(), keyword, pageable);
    }

    public List<UserResponse> getMembersByGroupId(Long groupId) {
        Group group = getById(groupId);
        return groupMemberService.getByGroup(group);
    }
}
