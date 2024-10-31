package com.social.network.repository.notification;

import com.social.network.entity.notification.Notification;
import com.social.network.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
    Page<Notification> findByRecipient(String requestor, Pageable pageable);
}
