package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.UserConversation;
import com.social.network.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserConversationRepo extends JpaRepository<UserConversation, Long> {
    @Query(value = "SELECT uc.conversation_id " +
            "FROM user_conversation uc " +
            "JOIN conversation c ON uc.conversation_id = c.id " +
            "WHERE uc.user_id = :userId " +
            "AND (:lastUpdate IS NULL OR c.last_update < CAST(:lastUpdate AS TIMESTAMP)) " +
            "ORDER BY c.last_update DESC",
            nativeQuery = true)
    Page<Long> findConversationIdsByUserId(Long userId, String lastUpdate, Pageable pageable);

    @Query("SELECT uc.userId FROM UserConversation uc WHERE uc.conversationId = :conversationId")
    List<Long> findUserIdsByConversationId(Long conversationId);

}
