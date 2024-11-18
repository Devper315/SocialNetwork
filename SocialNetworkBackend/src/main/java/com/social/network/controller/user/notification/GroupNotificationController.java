package com.social.network.controller.user.notification;

import com.social.network.dto.response.ApiResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.user.User;
import com.social.network.service.group.GroupService;
import com.social.network.service.notification.NotificationService;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/group/notifications")
public class GroupNotificationController {

    NotificationService notificationService;
    UserService userService;
    GroupService groupService;

    @PostMapping("/request")
    public ApiResponse<String> notifyGroupRequest(@RequestParam Long groupId) {
        User sender = userService.getCurrentUser();
        Group group = groupService.getById(groupId);
        User recipient = userService.getById(group.getCreateUserId());
        notificationService.notifyGroupRequest(sender, recipient, group);
        return ApiResponse.<String>builder()
                .result("Đã gửi thông báo yêu cầu tham gia nhóm.")
                .build();
    }

    @PostMapping("/accept")
    public ApiResponse<String> notifyAcceptGroup(@RequestParam Long groupId, @RequestParam Long userId) {
        User sender = userService.getCurrentUser();
        Group group = groupService.getById(groupId);
        User recipient = userService.getById(userId);
        notificationService.notifyAcceptGroup(sender, recipient, group);
        return ApiResponse.<String>builder()
                .result("Đã gửi thông báo chấp nhận tham gia nhóm.")
                .build();
    }
}
