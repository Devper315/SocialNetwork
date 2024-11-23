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
import jakarta.transaction.Transactional;
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
    UserRepo userRepo;
    GroupRoleRepo groupRoleRepo;
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
            responses.add(new UserResponse(user));
        }
        return responses;
    }

    public boolean changeMemberRole(Long groupId, Long userId, Long newRoleId) {
        Group group = groupRepo.findById(groupId).orElse(null);
        User user = userRepo.findById(userId).orElse(null);
        GroupMember groupMember = groupMemberRepo.findByGroupAndMember(group, user);
        groupMember.setRole(newRoleId);
        groupMemberRepo.save(groupMember);
        return true;
    }
}
