package com.social.network.repository.friend;

import com.social.network.entity.user.Friendship;
import com.social.network.entity.user.FriendshipId;
import com.social.network.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepo extends JpaRepository<Friendship, FriendshipId> {
    @Query(value = "SELECT f FROM Friendship f WHERE f.user1 = :requestor OR f.user2 = :requestor")
    List<Friendship> findMyFriendships(User requestor);

}
