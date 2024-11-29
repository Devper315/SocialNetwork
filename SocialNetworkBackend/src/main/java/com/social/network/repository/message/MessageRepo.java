package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<MessageCustom, Long> {
    @Query("SELECT m FROM MessageCustom m " +
            "WHERE (:lastId = 0 OR m.id < :lastId) AND m.conversation = :conversation " +
            "ORDER BY m.time DESC")
    List<MessageCustom> findByConversation(Conversation conversation, Long lastId, Pageable pageable);

    @Query("SELECT m FROM MessageCustom m WHERE m.conversation = :conversation ORDER BY m.time DESC")
    List<MessageCustom> getLastMessage(Conversation conversation, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE MessageCustom m set m.isRead = true WHERE m.id <= :lastMessageId " +
            "AND m.conversation.id = :conversationId AND m.isRead = false")
    void markAsRead(Long lastMessageId, Long conversationId);
}
