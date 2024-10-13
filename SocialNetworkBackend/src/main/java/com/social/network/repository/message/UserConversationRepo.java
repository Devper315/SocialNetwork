package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.message.UserConversationId;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserConversationRepo extends JpaRepository<UserConversation, UserConversationId> {
    List<UserConversation> findByUser(User user);

    List<UserConversation> findByConversation(Conversation conversation);
}
