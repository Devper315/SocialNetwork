package com.social.network.controller.group;

import com.social.network.dto.response.group.GroupRequestResponse;
import com.social.network.entity.group.GroupRequest;
import com.social.network.service.group.GroupRequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/group/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupRequestController {

    GroupRequestService groupRequestService;

    @PostMapping("/{groupId}")
    public ResponseEntity<GroupRequest> createGroupRequest(@PathVariable Long groupId) {
        GroupRequest groupRequest = groupRequestService.createGroupRequest(groupId);
        return groupRequest != null
                ? ResponseEntity.ok(groupRequest)
                : ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/{requestId}/action/{accept}")
    public ResponseEntity<String> actionRequest(
            @PathVariable Long requestId,
            @PathVariable Long accept
    ) {
        groupRequestService.actionRequestById(requestId, accept);
        return ResponseEntity.ok("Thanh cong");
    }

    @GetMapping("/{groupId}/admin-requests")
    public ResponseEntity<List<GroupRequestResponse>> getRequestsForAdmin(@PathVariable Long groupId) {
        List<GroupRequestResponse> responses = groupRequestService.getRequestsForAdmin(groupId);
        return ResponseEntity.ok(responses);
    }



    @GetMapping("/exists/{groupId}")
    public boolean checkIfRequestExists(@PathVariable Long groupId) {
        return groupRequestService.existsRequestByGroupAndUser(groupId);
    }
}
