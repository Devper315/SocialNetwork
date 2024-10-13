package com.social.network.service.message;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.post.Image;
import com.social.network.entity.post.Post;
import com.social.network.repository.post.ImageRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageService {
    ImageRepo imageRepo;

    public List<Image> getByMessage(MessageCustom message){
        return imageRepo.findByMessage(message);
    }

    public List<Image> getByPost(Post post){
        return imageRepo.findByPost(post);
    }
}
