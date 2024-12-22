package com.social.network.repository.post;

import com.social.network.entity.group.Group;
import com.social.network.entity.post.Post;
import com.social.network.entity.post.PostStatus;
import com.social.network.entity.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    List<Post> findByAuthor(User author);
    List<Post> findByGroupIdAndApprovalStatus(Long groupId, PostStatus approvalStatus);
    @Transactional
    @Modifying
    void deleteByGroup(Group group);
}
