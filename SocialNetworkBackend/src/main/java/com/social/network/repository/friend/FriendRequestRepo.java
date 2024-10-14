package com.social.network.repository.friend;

import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRequestRepo extends JpaRepository<FriendRequest, Long> {
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END " +
            "FROM FriendRequest f " +
            "WHERE (f.requestor = :user1 AND f.recipient = :user2) " +
            "OR (f.requestor = :user2 AND f.recipient = :user1)")
    boolean existsFriendRequest(User user1, User user2);
}
