package com.social.network.service.message;

import com.social.network.dto.conversation.MessageDTO;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.user.User;
import com.social.network.repository.message.UserConversationRepo;
import com.social.network.service.user.UserService;
import jakarta.persistence.Tuple;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserConversationService {
    UserConversationRepo userConversationRepo;
    UserService userService;

    public Page<Tuple> getByUser(User user, String lastUpdate, Pageable pageable){
        return userConversationRepo.findConversationIdsByUserId(user.getId(), lastUpdate, pageable);
    }

    public List<User> getByConversation(Conversation conversation) {
        List<Long> userIds = userConversationRepo.findUserIdsByConversationId(conversation.getId());
        return userService.getByIds(userIds);
    }

    public boolean checkConversationRead(Conversation conversation, User user){
        return userConversationRepo.checkConversationRead(conversation.getId(), user.getId());
    }

    public void createPrivateMember(Conversation conversation, User member1, User member2){
        UserConversation uc1 = UserConversation.builder()
                .conversationId(conversation.getId()).userId(member1.getId())
                .isRead(true)
                .build();
        UserConversation uc2 = UserConversation.builder()
                .conversationId(conversation.getId()).userId(member2.getId())
                .isRead(true)
                .build();
        userConversationRepo.save(uc1);
        userConversationRepo.save(uc2);
    }


    public void markAsUnread(Long conversationId, Long userId) {
        userConversationRepo.markAsUnread(conversationId, userId);
    }

    public void markAsRead(MessageDTO message) {
        User recipient = userService.getByUsername(message.getReader());
        userConversationRepo.markAsRead(message.getConversationId(), recipient.getId());
    }

    public Integer getUnreadTotal() {
        User requestor = userService.getCurrentUser();
        return userConversationRepo.getUnreadTotal(requestor.getId());
    }
}
