package com.social.network.controller.group;

import com.social.network.dto.group.GroupRequestDTO;
import com.social.network.dto.ApiResponse;
import com.social.network.entity.group.GroupRequest;
import com.social.network.service.group.GroupRequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupRequestController {

    GroupRequestService groupRequestService;

    @PostMapping("/{groupId}")
    public ApiResponse<GroupRequest> createGroupRequest(@PathVariable Long groupId) {
        return ApiResponse.<GroupRequest>builder()
                .result(groupRequestService.createGroupRequest(groupId))
                .build();
    }

    @PutMapping("/action")
    public void actionRequest(@RequestParam Long requestId, @RequestParam boolean accept) {
        groupRequestService.actionRequestById(requestId, accept);
    }

    @GetMapping("/{groupId}")
    public ApiResponse<List<GroupRequestDTO>> getRequests(@PathVariable Long groupId) {
        return ApiResponse.<List<GroupRequestDTO>>builder()
                .result(groupRequestService.getRequests(groupId))
                .build();
    }

}
