package com.social.network.service.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.user.User;
import com.social.network.repository.message.ConversationRepo;
import com.social.network.repository.message.UserConversationRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserConversationService {
    UserConversationRepo userConversationRepo;

    public List<UserConversation> getByUser(User user){
        return userConversationRepo.findByUser(user);
    }

    public List<UserConversation> getByConversation(Conversation conversation) {
        return userConversationRepo.findByConversation(conversation);
    }
}
