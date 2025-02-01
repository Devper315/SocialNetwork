package com.social.network.repository.post;

import com.social.network.entity.group.Group;
import com.social.network.entity.post.Comment;
import com.social.network.entity.post.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);

    @Transactional
    @Modifying
    void deleteByPost(Post post);
}
