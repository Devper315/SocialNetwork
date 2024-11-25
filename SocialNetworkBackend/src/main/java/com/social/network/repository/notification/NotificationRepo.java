package com.social.network.repository.notification;

import com.social.network.entity.notification.Notification;
import com.social.network.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n " +
            "WHERE (:lastId = 0 OR n.id < :lastId) AND n.recipient = :requestor " +
            "ORDER BY n.time DESC")
    Page<Notification> findByRecipient(String requestor, Long lastId, Pageable pageable);

    @Query("SELECT COUNT(n.id) FROM Notification n " +
            "WHERE n.recipient = :recipient AND n.isRead = false ")
    Long getUnreadTotal(String recipient);

}
