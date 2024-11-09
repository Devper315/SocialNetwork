package com.social.network.service.group;

import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupMemberRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.lang.reflect.Member;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMemberService {
    GroupMemberRepo groupMemberRepo;
    public boolean addGroupMember(Group group, User user) {
        GroupMember groupMember = GroupMember.builder()
                .group(group).member(user)
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
}
