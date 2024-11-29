package com.social.network.repository.message;

import com.social.network.entity.message.Emoji;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmojiRepo extends JpaRepository<Emoji, Long> {

    @Query("SELECT e FROM Emoji e WHERE (:lastId = 0 OR e.id > :lastId) ORDER BY e.id")
    List<Emoji> findAll(Long lastId, Pageable pageable);
}
