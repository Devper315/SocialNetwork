package com.social.network.repository.post;

import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.post.Image;
import com.social.network.entity.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepo extends JpaRepository<Image, Long> {
    List<Image> findByMessage(MessageCustom message);
    List<Image> findByPost(Post post);

}
