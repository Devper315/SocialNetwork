package com.social.network.controller.group;

import com.social.network.dto.group.GroupDTO;
import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.user.UserDTO;
import com.social.network.entity.group.Group;
import com.social.network.service.group.GroupService;
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

    @GetMapping
    public ApiResponse<List<Group>> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam int page, @RequestParam int size) {
        Page<Group> groupPage = groupService.search(keyword, page, size);
        return ApiResponse.<List<Group>>builder()
                .result(groupPage.getContent())
                .totalPages(groupPage.getTotalPages())
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<Group>> getMyGroup(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam int page, @RequestParam int size) {
        Page<Group> groupPage = groupService.searchMyGroups(keyword, page, size);
        return ApiResponse.<List<Group>>builder()
                .result(groupPage.getContent())
                .totalPages(groupPage.getTotalPages())
                .build();
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Group> getGroupById(@PathVariable Long id) {
        return ApiResponse.<Group>builder()
                .result(groupService.getById(id))
                .build();
    }


    @GetMapping("/members/{groupId}")
    public ApiResponse<List<UserDTO>> getMembersByGroupId(@PathVariable Long groupId) {
        return ApiResponse.<List<UserDTO>>builder()
                .result(groupService.getMembersByGroupId(groupId))
                .build();
    }

    @PostMapping("/add-member")
    public ApiResponse<Boolean> addMember(@RequestParam Long groupId, @RequestParam Long userId) {
        return ApiResponse.<Boolean>builder()
                .result(groupService.addGroupMember(groupId, userId))
                .build();
    }

    @DeleteMapping("/remove-member")
    public ApiResponse<Boolean> removeMember(@RequestParam Long groupId, @RequestParam Long userId) {
        return ApiResponse.<Boolean>builder()
                .result(groupService.removeGroupMember(groupId, userId))
                .build();
    }
    @DeleteMapping("/leave-group")
    public ApiResponse<Boolean> removeMember(@RequestParam Long groupId) {
        return ApiResponse.<Boolean>builder()
                .result(groupService.leaveGroup(groupId))
                .build();
    }

    @PostMapping
    public ApiResponse<Group> createGroup(@RequestBody GroupDTO request) {
        return ApiResponse.<Group>builder()
                .result(groupService.createGroup(request))
                .build();
    }

    @PutMapping
    public ApiResponse<Group> updateGroup(@RequestBody GroupDTO request) {
        return ApiResponse.<Group>builder()
                .result(groupService.updateGroup(request))
                .build();
    }

    @GetMapping("/check-user/{groupId}")
    public Long isGroupCreator(@PathVariable Long groupId) {
        return groupService.checkUser(groupId);
    }

    @PostMapping("/change-role/{groupId}/{userId}/{roleId}")
    public ApiResponse<Boolean> changeRole( @PathVariable Long groupId,@PathVariable Long userId, @PathVariable Long roleId) {
        return ApiResponse.<Boolean>builder()
                .result(groupService.changeMemberRole(groupId,userId,roleId))
                .build();
    }

    @GetMapping("get-role/{groupId}/{userId}")
    public ApiResponse<Long> getRole(@PathVariable Long groupId, @PathVariable Long userId) {
        return ApiResponse.<Long>builder()
                .result(groupService.getUserRoleInGroup(groupId,userId))
                .build();
    }

    @PostMapping("/change-createUserId/{groupId}/{userId}")
    public ApiResponse<Boolean> changCreateUserId( @PathVariable Long groupId,@PathVariable Long userId) {
        return ApiResponse.<Boolean>builder()
                .result(groupService.changeCreateUserId(groupId,userId))
                .build();
    }

    @DeleteMapping("/dissolve/{groupId}")
    public ApiResponse<Boolean> dissolveGroup( @PathVariable Long groupId) {
        return ApiResponse.<Boolean>builder()
                .result(groupService.dissolveGroup(groupId))
                .build();
    }

}
