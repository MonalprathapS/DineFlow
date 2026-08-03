package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.*;
import com.dineflow.dineflowbackend.entity.Notification;
import com.dineflow.dineflowbackend.entity.NotificationType;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public NotificationResponse createNotification(Long restaurantId, NotificationType type,
                                                     String message, String relatedUrl) {
        Notification notification = Notification.builder()
                .restaurantId(restaurantId)
                .type(type)
                .message(message)
                .relatedUrl(relatedUrl)
                .isRead(false)
                .build();
        return toResponse(notificationRepository.save(notification));
    }

    public List<NotificationResponse> getNotificationsByRestaurant(Long restaurantId) {
        return notificationRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getUnreadByRestaurant(Long restaurantId) {
        return notificationRepository.findByRestaurantIdAndIsReadFalseOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getUnreadByUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Long countUnreadByRestaurant(Long restaurantId) {
        return notificationRepository.countByRestaurantIdAndIsReadFalse(restaurantId);
    }

    public Long countUnreadByUser(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsReadByRestaurant(Long restaurantId) {
        List<Notification> notifications = notificationRepository
                .findByRestaurantIdAndIsReadFalseOrderByCreatedAtDesc(restaurantId);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void markAllAsReadByUser(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notificationRepository.deleteById(id);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .restaurantId(n.getRestaurantId())
                .userId(n.getUserId())
                .type(n.getType())
                .message(n.getMessage())
                .relatedUrl(n.getRelatedUrl())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
