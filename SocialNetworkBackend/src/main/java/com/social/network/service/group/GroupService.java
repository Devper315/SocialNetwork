package com.social.network.service.group;

import com.social.network.dto.request.group.GroupRequest;
import com.social.network.entity.group.Group;
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
                .name(request.getName())
                .createUserId(user.getId())
                .createTime(LocalDateTime.now())
                .build();
        group = groupRepo.save(group);
        groupMemberService.addGroupMember(group, user);
        return group;
    }

    public void addGroupMember(Long groupId, Long userId){
        User user = userService.getById(userId);
        Group group = getById(groupId);
        groupMemberService.addGroupMember(group, user);
    }

    public void removeGroupMember(Long groupId, Long userId){
        User user = userService.getById(userId);
        Group group = getById(groupId);
        groupMemberService.removeGroupMember(group, user);
    }

    public Group getById(Long id){
        return groupRepo.findById(id).orElse(null);
    }

    public Group updateGroup(GroupRequest request, Long id){
        Group group = groupRepo.findById(id).orElse(null);
        assert group != null;
        group.setName(request.getName());
        return groupRepo.save(group);
    }


    public Page<Group> search(String keyword, int page) {
        Pageable pageable = PageableUtils.createPageable(page, 20, "name");
        if (keyword.isEmpty()){
            return groupRepo.findAll(pageable);
        }
        keyword = "%" + keyword + "%";
        return groupRepo.search(keyword, pageable);
    }
}
