package com.social.network.repository.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<MessageCustom, Long> {
    List<MessageCustom> findByConversation(Conversation conversation, Sort sort);
}
