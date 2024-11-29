package com.social.network.service.message;

import com.social.network.dto.request.MessageDTO;
import com.social.network.dto.response.message.ConversationResponse;
import com.social.network.dto.response.message.MessageResponse;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.ConversationType;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.user.User;
import com.social.network.repository.message.ConversationRepo;
import com.social.network.service.image.ImageService;
import com.social.network.service.user.UserService;
import jakarta.persistence.Tuple;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    public ConversationResponse getResponseById(Long id) {
        Conversation conversation = getById(id);
        User requestor = userService.getCurrentUser();
        conversation.setRead(userConversationService.checkConversationRead(conversation, requestor));
        return toConversationResponse(requestor, conversation);
    }

    public List<ConversationResponse> getMyConversations(String lastUpdate) {
        User requestor = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Tuple> tuples = userConversationService.getByUser(requestor, lastUpdate, pageable);
        return tuples.stream().map(t -> {
            Long id = t.get(0, Long.class);
            Conversation conversation = getById(id);
            conversation.setRead(t.get(1, Boolean.class));
            return toConversationResponse(requestor, conversation);
        }).toList();
    }

    public void createMessage(MessageDTO request) {
        User recipient = userService.getByUsername(request.getRecipient());
        Conversation conversation = getById(request.getConversationId());
        conversation.setRead(userConversationService.checkConversationRead(conversation, recipient));
        request.setConversation(toConversationResponse(recipient, conversation));
        MessageCustom message = messageService.createMessage(request, conversation);
        request.setId(message.getId());
        conversation.setLastUpdate(message.getTime());
        conversationRepo.save(conversation);
        userConversationService.markAsUnread(conversation.getId(), recipient.getId());
    }

    private ConversationResponse toConversationResponse(User requestor, Conversation conversation) {
        List<User> members = userConversationService.getByConversation(conversation);
        return new ConversationResponse(conversation, members, requestor);
    }

    public ConversationResponse getConversationByFriendId(Long friendId) {
        User requestor = userService.getCurrentUser();
        User friend = userService.getById(friendId);
        Conversation conversation = conversationRepo.findConversation(requestor.getId(), friend.getId(), ConversationType.PRIVATE);
        if (conversation == null) {
            conversation = createPrivateConversation(requestor, friend);
            conversation.setRead(true);
        }
        else {
            conversation.setRead(userConversationService.checkConversationRead(conversation, requestor));
        }
        return toConversationResponse(requestor, conversation);
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

    public void markAsRead(MessageDTO messageDTO) {
        userConversationService.markAsRead(messageDTO);
    }

    public Integer getUnreadTotal() {
        return userConversationService.getUnreadTotal();
    }
}
