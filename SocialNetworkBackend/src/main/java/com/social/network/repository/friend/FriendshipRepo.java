package com.social.network.repository.friend;

import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.FriendshipId;
import com.social.network.entity.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepo extends JpaRepository<Friendship, FriendshipId> {
    @Query("SELECT u FROM Friendship f JOIN User u " +
            "ON (u = f.user1 AND f.user2 = :requestor) " +
            "OR (u = f.user2 AND f.user1 = :requestor)")
    Page<User> findMyFriendships(User requestor, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Friendship f " +
            "WHERE (f.user1 = :user1 AND f.user2 = :user2) " +
            "   OR (f.user1 = :user2 AND f.user2 = :user1)")
    boolean existsByUsers(User user1, User user2);

    @Transactional
    @Modifying
    @Query("DELETE FROM Friendship f " +
            "WHERE (f.user1 = :requestor AND f.user2 = :friend) " +
            "OR (f.user1 = :friend AND f.user2 = :requestor)")
    void deleteByUsers(User requestor, User friend);
}
