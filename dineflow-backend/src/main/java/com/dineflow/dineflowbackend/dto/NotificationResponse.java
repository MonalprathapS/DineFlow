package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private Long restaurantId;
    private Long userId;
    private NotificationType type;
    private String message;
    private String relatedUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
