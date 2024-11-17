package com.social.network.controller.user.notification;

import com.social.network.dto.response.ApiResponse;
import com.social.network.entity.notification.Notification;
import com.social.network.service.notification.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;


    @GetMapping(value = "/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Notification> connectSSE(@RequestParam String token) {
        return notificationService.getNotificationFlux(token);
    }

    @GetMapping("/api/notifications")
    public ApiResponse<List<Notification>> getMyNotification(@RequestParam Long lastId){
        return ApiResponse.<List<Notification>>builder()
                .result(notificationService.getMyNotifications(lastId))
                .build();
    }

    @PatchMapping("/api/notifications/{id}")
    public void markAsRead(@PathVariable Long id){
        notificationService.markAsRead(id);
    }
}
