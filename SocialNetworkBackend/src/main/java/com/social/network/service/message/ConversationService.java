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
import com.social.network.utils.PageableUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
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

    public List<ConversationResponse> getMyConversations(String lastUpdate) {
        User requestor = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Long> conversationIds = userConversationService.getByUser(requestor, lastUpdate, pageable);
        List<Conversation> conversations = conversationRepo.findByIds(conversationIds.getContent());
        return conversations.stream()
                .map(conversation -> {
                    List<User> members = userConversationService.getByConversation(conversation);
                    return new ConversationResponse(conversation, members, requestor);
                }).toList();
    }

    public void createMessage(MessageCreateRequest request) {
        Conversation conversation = getById(request.getConversationId());
        LocalDateTime lastUpdate = messageService.createMessage(request, conversation);
        conversation.setLastUpdate(lastUpdate);
        conversationRepo.save(conversation);
    }

    public ConversationResponse getConversationByFriendId(Long friendId) {
        User requestor = userService.getCurrentUser();
        User friend = userService.getById(friendId);
        Conversation conversation = conversationRepo.findConversation(requestor.getId(), friend.getId(), ConversationType.PRIVATE);
        if (conversation == null) {
            conversation = createPrivateConversation(requestor, friend);
        }
        List<User> members = userConversationService.getByConversation(conversation);
        return new ConversationResponse(conversation, members, requestor);
    }

    private Conversation createPrivateConversation(User requestor, User friend) {
        Conversation conversation = Conversation.builder()
                .type(ConversationType.PRIVATE).lastUpdate(LocalDateTime.now())
                .build();
        conversation = conversationRepo.save(conversation);
        userConversationService.createPrivateMember(conversation, requestor, friend);
        return conversation;
    }

    public List<MessageResponse> getMessageByConversationId(Long conversationId, Long lastId) {
        Conversation conversation = getById(conversationId);
        List<MessageCustom> messages = messageService.getByConversation(conversation, lastId);
        List<MessageCustom> sortableMessages = new ArrayList<>(messages);
        Collections.sort(sortableMessages);
        return sortableMessages.stream().map(MessageResponse::new).toList();
    }


}
