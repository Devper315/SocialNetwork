package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.social.network.entity.message.ConversationType;

import java.util.List;

@Repository
public interface ConversationRepo extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c " +
            "JOIN UserConversation uc1 ON uc1.conversationId = c.id " +
            "JOIN UserConversation uc2 ON uc2.conversationId = c.id " +
            "WHERE c.type = :type AND" +
            "(uc1.userId = :requestorId AND uc2.userId = :friendId) OR " +
            "(uc2.userId = :friendId AND uc2.userId = :requestorId)")
    Conversation findConversation(Long requestorId, Long friendId, ConversationType type);

    @Query("SELECT c FROM Conversation c WHERE c.id in :ids ORDER BY c.lastUpdate DESC")
    List<Conversation> findByIds(List<Long> ids);

}
