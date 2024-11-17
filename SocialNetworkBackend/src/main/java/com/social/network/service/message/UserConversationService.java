package com.social.network.service.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.user.User;
import com.social.network.repository.message.ConversationRepo;
import com.social.network.repository.message.UserConversationRepo;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserConversationService {
    UserConversationRepo userConversationRepo;
    UserService userService;

    public Page<Long> getByUser(User user, String lastUpdate, Pageable pageable){
        return userConversationRepo.findConversationIdsByUserId(user.getId(), lastUpdate, pageable);
    }

    public List<User> getByConversation(Conversation conversation) {
        List<Long> userIds = userConversationRepo.findUserIdsByConversationId(conversation.getId());
        return userService.getByIds(userIds);
    }

    public void createPrivateMember(Conversation conversation, User member1, User member2){
        UserConversation uc1 = UserConversation.builder()
                .conversationId(conversation.getId()).userId(member1.getId())
                .build();
        UserConversation uc2 = UserConversation.builder()
                .conversationId(conversation.getId()).userId(member2.getId())
                .build();
        userConversationRepo.save(uc1);
        userConversationRepo.save(uc2);
    }


}
