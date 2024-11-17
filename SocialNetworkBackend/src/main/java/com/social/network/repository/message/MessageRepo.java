package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<MessageCustom, Long> {
    @Query("SELECT m FROM MessageCustom m " +
            "WHERE (:lastId = 0 OR m.id < :lastId) AND m.conversation = :conversation " +
            "ORDER BY m.time DESC")
    Page<MessageCustom> findByConversation(Conversation conversation, Long lastId, Pageable pageable);
}
