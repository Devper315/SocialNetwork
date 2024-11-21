package com.social.network.repository.message;

import com.social.network.entity.message.UserConversation;
import com.social.network.entity.user.User;
import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserConversationRepo extends JpaRepository<UserConversation, Long> {
    @Query(value = "SELECT uc.conversation_id, uc.is_read " +
            "FROM user_conversation uc " +
            "JOIN conversation c ON uc.conversation_id = c.id " +
            "WHERE uc.user_id = :userId " +
            "AND (:lastUpdate IS NULL OR c.last_update < CAST(:lastUpdate AS TIMESTAMP)) " +
            "ORDER BY c.last_update DESC",
            nativeQuery = true)
    Page<Tuple> findConversationIdsByUserId(Long userId, String lastUpdate, Pageable pageable);

    @Query("SELECT uc.userId FROM UserConversation uc WHERE uc.conversationId = :conversationId")
    List<Long> findUserIdsByConversationId(Long conversationId);

    @Query("SELECT uc.isRead FROM UserConversation uc " +
            "WHERE uc.conversationId = :conversationId AND uc.userId = :userId")
    boolean checkConversationRead(Long conversationId, Long userId);

    @Transactional
    @Modifying
    @Query("UPDATE UserConversation uc set uc.isRead = false " +
            "WHERE uc.conversationId = :conversationId AND uc.userId = :userId")
    void markAsUnread(Long conversationId, Long userId);

    @Transactional
    @Modifying
    @Query("UPDATE UserConversation uc set uc.isRead = true " +
            "WHERE uc.conversationId = :conversationId AND uc.userId = :userId")
    void markAsRead(Long conversationId, Long userId);

    @Query("SELECT COUNT(uc.id) FROM UserConversation uc " +
            "WHERE uc.userId = :userId AND uc.isRead = false ")
    Integer getUnreadTotal(Long userId);
}
