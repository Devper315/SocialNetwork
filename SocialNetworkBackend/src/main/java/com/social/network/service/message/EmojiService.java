package com.social.network.service.message;

import com.social.network.entity.message.Emoji;
import com.social.network.repository.message.EmojiRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmojiService {
    EmojiRepo emojiRepo;

    public List<Emoji> getAll(Long lastId){
        Pageable pageable = PageRequest.of(0, 50);
        return emojiRepo.findAll(lastId, pageable);
    }
}
