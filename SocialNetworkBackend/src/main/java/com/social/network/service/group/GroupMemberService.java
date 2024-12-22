package com.social.network.service.group;

import com.social.network.dto.user.UserDTO;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.group.GroupRole;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupMemberRepo;
import com.social.network.repository.group.GroupRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMemberService {
    GroupMemberRepo groupMemberRepo;

    public boolean addGroupMember(Group group, User user, String role) {
        GroupMember groupMember = GroupMember.builder()
                .group(group).member(user).role(GroupRole.valueOf(role))
                .build();
        groupMemberRepo.save(groupMember);
        return true;
    }

    public boolean removeGroupMember(Group group, User member) {
        groupMemberRepo.deleteByGroupAndMember(group, member);
        return true;
    }

    public boolean existsByGroupAndMember(Group group, User member) {
        return groupMemberRepo.existsByGroupAndMember(group, member);
    }

    public List<UserDTO> getByGroup(Group group) {
        List<GroupMember> groupMembers = groupMemberRepo.findByGroup(group);
        return groupMembers.stream().map(UserDTO::new).sorted().toList();
    }

    public GroupMember getByGroupAndMember(Group group, User user){
        return groupMemberRepo.findByGroupAndMember(group, user);
    }

    public boolean changeMemberRole(Group group, User user, String newRole) {
        GroupMember groupMember = getByGroupAndMember(group, user);
        groupMember.setRole(GroupRole.valueOf(newRole));
        groupMemberRepo.save(groupMember);
        return true;
    }

    public void removeAllGroupMembers(Group group) {
        groupMemberRepo.deleteByGroup(group);
    }

    public Long getTotalMember(Group group) {
        return groupMemberRepo.getTotalMember(group);
    }
}
