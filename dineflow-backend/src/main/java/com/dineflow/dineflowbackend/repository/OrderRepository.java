package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.Order;
import com.dineflow.dineflowbackend.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    List<Order> findByRestaurantIdAndStatusOrderByCreatedAtDesc(Long restaurantId, OrderStatus status);

    List<Order> findByAssignedWaiterIdOrderByCreatedAtDesc(Long waiterId);

    List<Order> findByTableIdOrderByCreatedAtDesc(Long tableId);

    @Query("SELECT o FROM Order o WHERE o.restaurant.id = :restaurantId AND o.createdAt BETWEEN :start AND :end ORDER BY o.createdAt DESC")
    List<Order> findByRestaurantIdAndDateRange(
            @Param("restaurantId") Long restaurantId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.restaurant.id = :restaurantId AND o.status <> 'CANCELLED' AND o.paymentStatus = 'PAID' AND o.createdAt BETWEEN :start AND :end")
    BigDecimal calculateRevenue(
            @Param("restaurantId") Long restaurantId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.restaurant.id = :restaurantId AND o.status = :status")
    Long countByRestaurantIdAndStatus(@Param("restaurantId") Long restaurantId, @Param("status") OrderStatus status);

    Page<Order> findByRestaurantId(Long restaurantId, Pageable pageable);

    Page<Order> findByCustomerId(Long customerId, Pageable pageable);
}
