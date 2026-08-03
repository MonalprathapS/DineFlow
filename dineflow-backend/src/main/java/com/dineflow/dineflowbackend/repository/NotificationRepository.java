package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.Notification;
import com.dineflow.dineflowbackend.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByRestaurantIdAndIsReadFalseOrderByCreatedAtDesc(Long restaurantId);

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    Long countByRestaurantIdAndIsReadFalse(Long restaurantId);

    Long countByUserIdAndIsReadFalse(Long userId);

    List<Notification> findByRestaurantIdAndTypeOrderByCreatedAtDesc(Long restaurantId, NotificationType type);
}
