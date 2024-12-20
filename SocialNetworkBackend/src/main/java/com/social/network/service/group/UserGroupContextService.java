package com.social.network.service.group;

import com.social.network.dto.group.UserGroupContext;
import com.social.network.entity.group.Group;
import com.social.network.entity.user.User;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserGroupContextService {
    GroupService groupService;
    UserService userService;
    GroupMemberService groupMemberService;
    GroupRequestService groupRequestService;
    public UserGroupContext getUserGroupContext(Long groupId) {
        Group group = groupService.getById(groupId);
        User requestor = userService.getCurrentUser();
        boolean owner, requestSent, member = false;
        owner = group.getCreateUserId().equals(requestor.getId());
        requestSent = groupRequestService.existsRequest(group, requestor);
        if (!owner) member = groupMemberService.existsByGroupAndMember(group, requestor);
        return UserGroupContext.builder()
                .owner(owner).member(member).joined(owner || member).requestSent(requestSent)
                .build();
    }
}
