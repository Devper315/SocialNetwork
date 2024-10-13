package com.social.network.repository.user;

import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.FriendshipId;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepo extends JpaRepository<Friendship, FriendshipId> {
    @Query("SELECT CASE WHEN f.user1 = :requestor THEN f.user2 ELSE f.user1 END " +
           "FROM Friendship f WHERE f.user1 = :requestor OR f.user2 = :requestor")
    List<User> findFriends(User requestor);

}
