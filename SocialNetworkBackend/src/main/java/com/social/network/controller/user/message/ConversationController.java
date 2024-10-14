package com.social.network.controller.user.message;

import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.message.ConversationResponse;
import com.social.network.service.message.ConversationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/conversation")
public class ConversationController {
    ConversationService conversationService;

    @GetMapping("/{friendId}")
    public ApiResponse<ConversationResponse> getConversationByFriendId(@PathVariable Long friendId){
        return ApiResponse.<ConversationResponse>builder()
                .result(conversationService.getConversationByFriendId(friendId))
                .build();
    }
}
