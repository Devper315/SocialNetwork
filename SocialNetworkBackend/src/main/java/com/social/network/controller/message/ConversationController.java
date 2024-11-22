package com.social.network.controller.message;

import com.social.network.dto.response.ApiResponse;
import com.social.network.dto.response.message.ConversationResponse;
import com.social.network.dto.response.message.MessageResponse;
import com.social.network.service.message.ConversationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/conversation")
public class ConversationController {
    ConversationService conversationService;

    @GetMapping("/friend/{friendId}")
    public ApiResponse<ConversationResponse> getConversationByFriendId(@PathVariable Long friendId){
        return ApiResponse.<ConversationResponse>builder()
                .result(conversationService.getConversationByFriendId(friendId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ConversationResponse> getConversationById(@PathVariable Long id){
        return ApiResponse.<ConversationResponse>builder()
                .result(conversationService.getResponseById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ConversationResponse>> getMyConversations(
            @RequestParam(required = false) String lastUpdate){
        return ApiResponse.<List<ConversationResponse>>builder()
                .result(conversationService.getMyConversations(lastUpdate))
                .build();
    }

    @GetMapping("/message/{conversationId}")
    public ApiResponse<List<MessageResponse>> getMessageByConversationId(
            @PathVariable Long conversationId, @RequestParam Long lastId){
        return ApiResponse.<List<MessageResponse>>builder()
                .result(conversationService.getMessageByConversationId(conversationId, lastId))
                .build();
    }

    @GetMapping("/unread-total")
    public ApiResponse<Integer> getUnreadTotal(){
        return ApiResponse.<Integer>builder()
                .result(conversationService.getUnreadTotal())
                .build();
    }
}
