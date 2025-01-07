package com.social.network.repository.post;

import com.social.network.entity.group.Group;
import com.social.network.entity.post.Post;
import com.social.network.entity.post.PostStatus;
import com.social.network.entity.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.author = :author AND p.group IS NULL")
    List<Post> findByAuthor(User author);
    List<Post> findByGroupIdAndApprovalStatus(Long groupId, PostStatus approvalStatus);

    @Query("SELECT p FROM Post p WHERE p.approvalStatus IS NULL OR p.approvalStatus = :approvedStatus")
    List<Post> findAllPost(PostStatus approvedStatus);
    @Transactional
    @Modifying
    void deleteByGroup(Group group);
}
