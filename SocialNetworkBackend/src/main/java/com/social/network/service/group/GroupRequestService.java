package com.social.network.service.group;

import com.social.network.dto.response.group.GroupRequestResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.group.GroupRequest;
import com.social.network.entity.user.User;
import com.social.network.mapper.GroupRequestMapper;
import com.social.network.repository.group.GroupRequestRepo;
import com.social.network.service.notification.NotificationService;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupRequestService {
    GroupRequestRepo groupRequestRepo;
    UserService userService;
    GroupService groupService;
    NotificationService notificationService;

    public GroupRequest createGroupRequest(Long groupId) {
        Group group = groupService.getById(groupId);
        User user = userService.getCurrentUser();
        User createGroup = userService.getById(group.getCreateUserId());
        GroupRequest request = GroupRequest.builder()
                .group(group)
                .user(user)
                .status(0)
                .time(LocalDateTime.now())
                .build();
        request = groupRequestRepo.save(request);
        notificationService.notifyGroupRequest(user,createGroup,group);
        return request;
    }

    public void actionRequestById(Long requestId, Long accept) {
        GroupRequest request = getById(requestId);
        User user = userService.getCurrentUser();
        User receiver = request.getUser();
        if (accept==1) {
            groupService.addGroupMember(request.getGroup().getId(), receiver.getId());
            notificationService.notifyAcceptGroupRequest(user,receiver,request.getGroup());
        }
        else{
            notificationService.notifyRefuseGroupRequest(user,receiver,request.getGroup());
        }
        groupRequestRepo.delete(request);
    }

    public GroupRequest getById(Long requestId) {
        return groupRequestRepo.findById(requestId).orElseThrow();
    }

    public List<GroupRequestResponse> getRequestsForAdmin(Long groupId) {
        Group group = groupService.getById(groupId);
        List<GroupRequest> groupRequests = groupRequestRepo.findByGroup(group);
        return groupRequests.stream()
                .map(GroupRequestResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<GroupRequest> getRequestByGroupAndUser(Group group, User user) {
        return groupRequestRepo.findByGroupAndUser(group, user);
    }

    public boolean existsRequestByGroupAndUser(Long groupId) {
        Group group = groupService.getById(groupId);
        User user = userService.getCurrentUser();
        return groupRequestRepo.existsByGroupAndUser(group, user);
    }





}
