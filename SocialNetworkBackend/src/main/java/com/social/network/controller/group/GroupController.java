package com.social.network.controller.group;

import com.social.network.dto.request.group.GroupRequest;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.post.PostResponse;
import com.social.network.dto.response.user.UserResponse;
import com.social.network.entity.group.Group;
import com.social.network.entity.user.User;
import com.social.network.service.group.GroupService;
import com.social.network.service.notification.NotificationService;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user/group")
public class GroupController {
    GroupService groupService;
    UserService userService;
    NotificationService notificationService;
    @GetMapping
    public ApiResponse<List<Group>> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam int page){
        Page<Group> groupPage = groupService.search(keyword, page);
        return ApiResponse.<List<Group>>builder()
                .result(groupPage.getContent())
                .totalPages(groupPage.getTotalPages())
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<Group>> getMyGroup(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam int page){
        Page<Group> groupPage = groupService.searchMyGroups(keyword, page);
        return ApiResponse.<List<Group>>builder()
                .result(groupPage.getContent())
                .totalPages(groupPage.getTotalPages())
                .build();
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Group> getGroupById(@PathVariable Long id){
        return ApiResponse.<Group>builder()
                .result(groupService.getById(id))
                .build();
    }



    @GetMapping("/members/{groupId}")
    public ApiResponse<List<UserResponse>> getMembersByGroupId(@PathVariable Long groupId){
        return ApiResponse.<List<UserResponse>>builder()
                .result(groupService.getMembersByGroupId(groupId))
                .build();
    }

    @PostMapping ("/add-member")
    public ApiResponse<Boolean> addMember(@RequestParam Long groupId, @RequestParam Long userId){
        return ApiResponse.<Boolean>builder()
                .result(groupService.addGroupMember(groupId, userId))
                .build();
    }

    @DeleteMapping("/remove-member")
    public ApiResponse<Boolean> removeMember(@RequestParam Long groupId, @RequestParam Long userId){
        return ApiResponse.<Boolean>builder()
                .result(groupService.removeGroupMember(groupId, userId))
                .build();
    }

    @PostMapping
    public ApiResponse<Group> createGroup(@RequestBody GroupRequest request){
        return ApiResponse.<Group>builder()
                .result(groupService.createGroup(request))
                .build();
    }

    @PutMapping
    public ApiResponse<Group> updateGroup(@RequestBody GroupRequest request){
        return ApiResponse.<Group>builder()
                .result(groupService.updateGroup(request))
                .build();
    }



}
