package com.social.network.service.notification;

import com.social.network.config.JWTDecoder;
import com.social.network.entity.notification.Notification;
import com.social.network.entity.user.User;
import com.social.network.repository.notification.NotificationRepo;
import com.social.network.service.user.UserService;
import com.social.network.utils.PageableUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    Map<String, Sinks.Many<Notification>> notificationSinks = new ConcurrentHashMap<>();
    NotificationRepo notificationRepo;
    UserService userService;
    JWTDecoder jwtDecoder;

    public Flux<Notification> getNotificationFlux(String token) {
        String username = jwtDecoder.extractUsernameFromToken(token);
        if (username == null) {
            return Flux.error(new IllegalArgumentException("Token không hợp lệ hoặc hết hạn"));
        }
        Sinks.Many<Notification> sink = notificationSinks.computeIfAbsent(username,
                usn -> Sinks.many().multicast().directBestEffort());
        return sink.asFlux()
                .doOnCancel(() -> notificationSinks.remove(username));
    }

    public void notifyFriendRequest(User requestor, User recipient) {
        String content = requestor.getFullName() + " đã gửi lời mời kết bạn.";
        createNotification(requestor, recipient, content);
    }

    public void notifyAcceptFriend(User requestor, User recipient) {
        String content = requestor.getFullName() + " đã chấp nhận kết bạn";
        createNotification(requestor, recipient, content);
    }

    private void createNotification(User requestor, User recipient, String content){
        Notification notification = Notification.builder()
                .content(content)
                .recipient(recipient.getUsername())
                .navigateUrl("/profile/" + requestor.getId())
                .isRead(false)
                .time(LocalDateTime.now())
                .build();
        notificationRepo.save(notification);
        Mono.delay(Duration.ofSeconds(1))
                .doOnSuccess(ignored ->
                                Optional.ofNullable(notificationSinks.get(recipient.getUsername()))
                                        .ifPresent(n -> n.tryEmitNext(notification)))
                .subscribe();
    }

    public Page<Notification> getMyNotifications(int page) {
        User requestor = userService.getCurrentUser();
        Pageable pageable = PageableUtils.createPageable(page, 10, "time");
        return notificationRepo.findByRecipient(requestor.getUsername(), pageable);
    }

    public void markAsRead(Long id) {
        notificationRepo.findById(id)
                .ifPresent(n -> {
                    n.setRead(true);
                    notificationRepo.save(n);
                });
    }


}