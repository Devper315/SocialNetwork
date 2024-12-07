package com.social.network.service.group;

import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.group.GroupRole;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupMemberRepo;
import com.social.network.repository.group.GroupRepo;
import com.social.network.repository.group.GroupRoleRepo;
import com.social.network.repository.user.UserRepo;
import com.social.network.service.user.UserService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.repository.Modifying;
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

    public boolean removeGroupMember(Group group, User member){
        groupMemberRepo.deleteByGroupAndMember(group, member);
        return true;
    }

    public boolean existsByGroupAndMember(Group group, User member){
        return groupMemberRepo.existsByGroupAndMember(group, member);
    }

    public List<UserResponse> getByGroup(Group group) {
        List<GroupMember> groupMembers = groupMemberRepo.findByGroup(group);
        return toUserResponses(groupMembers);
    }

    private List<UserResponse> toUserResponses(List<GroupMember> groupMembers){
        List <UserResponse> responses = new ArrayList<>();
        for (GroupMember groupMember: groupMembers){
            User user = groupMember.getMember();
            Long role = groupMember.getRole();
            responses.add(new UserResponse(user,role));
        }
        return responses;
    }

    public boolean changeMemberRole(Group group, User user, Long newRoleId) {
        GroupMember groupMember = groupMemberRepo.findByGroupAndMember(group, user);
        groupMember.setRole(newRoleId);
        groupMemberRepo.save(groupMember);
        return true;
    }

    public Long getUserRoleInGroup(Group group,User user) {
        GroupMember groupMember = groupMemberRepo.findByGroupAndMember(group, user);
        return groupMember.getRole();
    }

    public void changeCreateUserId(Group group,User user){
        group.setCreateUserId(user.getId());
        groupRepo.save(group);
    }

    public void removeAllGroupMembers(Group group) {
        groupMemberRepo.deleteByGroup(group);
    }

}
