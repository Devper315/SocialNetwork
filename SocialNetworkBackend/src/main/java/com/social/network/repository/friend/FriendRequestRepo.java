package com.social.network.repository.friend;

import com.social.network.entity.user.FriendRequest;
import com.social.network.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRequestRepo extends JpaRepository<FriendRequest, Long> {
    @Query("SELECT f FROM FriendRequest f WHERE f.requestor = :requestor AND f.recipient = :recipient")
    FriendRequest findRequestByUsers(User requestor, User recipient);

    @Query("SELECT f FROM FriendRequest f " +
            "WHERE (f.requestor = :requestor AND f.recipient = :recipient) " +
            "OR (f.requestor = :recipient AND f.recipient = :requestor)")
    FriendRequest findRequestByBothUsers(User requestor, User recipient);

    Page<FriendRequest> findByRecipient(User recipient, Pageable pageable);

}
