package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.OrderItem;
import com.dineflow.dineflowbackend.entity.OrderItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByOrderRestaurantIdAndStatus(Long restaurantId, OrderItemStatus status);

    @Query("SELECT oi.menuItem.id, SUM(oi.quantity) as totalQty FROM OrderItem oi " +
           "WHERE oi.order.restaurant.id = :restaurantId AND oi.order.status <> 'CANCELLED' " +
           "GROUP BY oi.menuItem.id ORDER BY totalQty DESC")
    List<Object[]> findTopSellingItems(@Param("restaurantId") Long restaurantId);
}
