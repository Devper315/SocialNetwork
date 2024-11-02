package com.social.network.service.group;

import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupMember;
import com.social.network.entity.user.User;
import com.social.network.repository.group.GroupMemberRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupMemberService {
    GroupMemberRepo groupMemberRepo;
    public void addGroupMember(Group group, User user) {
        GroupMember groupMember = GroupMember.builder()
                .group(group).member(user)
                .build();
        groupMemberRepo.save(groupMember);
    }

    public void removeGroupMember(Group group, User member){
        groupMemberRepo.deleteByGroupAndMember(group, member);
    }
}
