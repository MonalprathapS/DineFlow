package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.NotificationResponse;
import com.dineflow.dineflowbackend.service.NotificationService;
import com.dineflow.dineflowbackend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    public NotificationController(NotificationService notificationService, JwtUtil jwtUtil) {
        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getNotifications(
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        if (restaurantId != null) {
            List<NotificationResponse> notifications = unreadOnly
                    ? notificationService.getUnreadByRestaurant(restaurantId)
                    : notificationService.getNotificationsByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        }

        if (userId != null) {
            List<NotificationResponse> notifications = unreadOnly
                    ? notificationService.getUnreadByUser(userId)
                    : notificationService.getNotificationsByUser(userId);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("restaurantId or authenticated user is required"));
    }

    @GetMapping("/count-unread")
    public ResponseEntity<ApiResponse<Long>> countUnread(
            @RequestParam(required = false) Long restaurantId,
            HttpServletRequest httpRequest) {

        if (restaurantId != null) {
            return ResponseEntity.ok(ApiResponse.success(notificationService.countUnreadByRestaurant(restaurantId)));
        }

        Long userId = extractUserId(httpRequest);
        if (userId != null) {
            return ResponseEntity.ok(ApiResponse.success(notificationService.countUnreadByUser(userId)));
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("restaurantId or authenticated user is required"));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable Long id) {
        NotificationResponse notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", notification));
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(
            @RequestParam(required = false) Long restaurantId,
            HttpServletRequest httpRequest) {

        if (restaurantId != null) {
            notificationService.markAllAsReadByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
        }

        Long userId = extractUserId(httpRequest);
        if (userId != null) {
            notificationService.markAllAsReadByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("restaurantId or authenticated user is required"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }
}
