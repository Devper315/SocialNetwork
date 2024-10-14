package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.social.network.entity.message.ConversationType;
import java.util.List;

@Repository
public interface ConversationRepo extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c " +
            "WHERE (c.user1 = :requestor AND c.user2 = :friend)" +
            "OR    (c.user2 = :requestor AND c.user1 = :friend)" +
            "AND c.type = com.social.network.entity.message.ConversationType.PRIVATE")
    Conversation findPrivateConversation(User requestor, User friend);
}
