package com.social.network.repository.post;

import com.social.network.entity.post.Post;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    List<Post> findByAuthor(User author);
}
