package com.social.network.service.group;

import com.social.network.dto.user.UserDTO;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupMemberRepo;
import com.social.network.repository.group.GroupRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMemberService {
    GroupMemberRepo groupMemberRepo;
    GroupRepo groupRepo;

    public boolean addGroupMember(Group group, User user, Long role) {
        GroupMember groupMember = GroupMember.builder()
                .group(group)
                .member(user)
                .role(role)
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
        return toUserDTOs(groupMembers);
    }

    private List<UserDTO> toUserDTOs(List<GroupMember> groupMembers) {
        List<UserDTO> responses = new ArrayList<>();
        for (GroupMember groupMember : groupMembers) {
            User user = groupMember.getMember();
            Long role = groupMember.getRole();
            responses.add(new UserDTO(user, role));
        }
        return responses;
    }

    public boolean changeMemberRole(Group group, User user, Long newRoleId) {
        GroupMember groupMember = groupMemberRepo.findByGroupAndMember(group, user);
        groupMember.setRole(newRoleId);
        groupMemberRepo.save(groupMember);
        return true;
    }

    public Long getUserRoleInGroup(Group group, User user) {
        GroupMember groupMember = groupMemberRepo.findByGroupAndMember(group, user);
        return groupMember.getRole();
    }

    public void changeCreateUserId(Group group, User user) {
        group.setCreateUserId(user.getId());
        groupRepo.save(group);
    }

    public void removeAllGroupMembers(Group group) {
        groupMemberRepo.deleteByGroup(group);
    }

}
