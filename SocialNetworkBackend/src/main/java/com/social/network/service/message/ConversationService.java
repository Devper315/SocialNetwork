package com.social.network.service.message;

import com.social.network.dto.request.MessageCreateRequest;
import com.social.network.dto.response.message.ConversationResponse;
import com.social.network.dto.response.message.MessageResponse;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.ConversationType;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.user.User;
import com.social.network.repository.message.ConversationRepo;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConversationService {
    ConversationRepo conversationRepo;
    UserConversationService userConversationService;
    UserService userService;
    MessageService messageService;

    public Conversation getById(Long id) {
        return conversationRepo.findById(id).orElse(null);
    }

    public List<ConversationResponse> getMyConversations() {
        User requestor = userService.getCurrentUser();
        List<UserConversation> userConversations = userConversationService.getByUser(requestor);
        List<ConversationResponse> responses = new ArrayList<>();
        for (UserConversation uc : userConversations) {
            ConversationResponse response = toConversationResponse(uc.getConversation(), requestor);
            responses.add(response);
        }
        return responses;
    }

    public void createMessage(MessageCreateRequest request) {
        Conversation conversation = getById(request.getConversationId());
        messageService.createMessage(request, conversation);
    }

    public ConversationResponse getConversationByFriendId(Long friendId) {
        User requestor = userService.getCurrentUser();
        User friend = userService.getById(friendId);
        Conversation conversation = conversationRepo.findPrivateConversation(requestor, friend);
        if (conversation == null) {
            conversation = createPrivateConversation(requestor, friend);
        }
        return toConversationResponse(conversation, requestor);
    }

    private Conversation createPrivateConversation(User requestor, User friend) {
        Conversation conversation = Conversation.builder()
                .user1(requestor).user2(friend)
                .type(ConversationType.PRIVATE)
                .build();
        return conversationRepo.save(conversation);
    }

    private ConversationResponse toConversationResponse(Conversation conversation, User requestor) {
        ConversationResponse response = new ConversationResponse(conversation, requestor);
        List<MessageResponse> messageList = messageService.getByConversation(conversation)
                .stream().map(MessageResponse::new).toList();
        response.setMessageList(messageList);
        return response;
    }
}
