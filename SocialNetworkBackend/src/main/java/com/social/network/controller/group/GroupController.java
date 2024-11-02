package com.social.network.controller.group;

import com.social.network.dto.request.group.GroupRequest;
import com.social.network.dto.response.ApiResponse;
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
            @RequestParam int page){
        Page<Group> groupPage = groupService.search(keyword, page);
        return ApiResponse.<List<Group>>builder()
                .result(groupPage.getContent())
                .totalPages(groupPage.getTotalPages())
                .build();
    }

    @PutMapping("/add-member")
    public void addMember(@RequestParam Long groupId, @RequestParam Long userId){
        groupService.addGroupMember(groupId, userId);
    }

    @PutMapping("/remove-member")
    public void removeMember(@RequestParam Long groupId, @RequestParam Long userId){
        groupService.removeGroupMember(groupId, userId);
    }

    @PostMapping
    public ApiResponse<Group> createGroup(@RequestBody GroupRequest request){
        return ApiResponse.<Group>builder()
                .result(groupService.createGroup(request))
                .build();
    }

    @PutMapping
    public ApiResponse<Group> updateGroup(@RequestBody GroupRequest request, @RequestParam Long id){
        return ApiResponse.<Group>builder()
                .result(groupService.updateGroup(request, id))
                .build();
    }
}
