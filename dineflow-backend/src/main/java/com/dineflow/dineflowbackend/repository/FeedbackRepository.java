package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    Page<Feedback> findByRestaurantId(Long restaurantId, Pageable pageable);

    List<Feedback> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Feedback> findByOrderId(Long orderId);

    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM Feedback f WHERE f.restaurant.id = :restaurantId")
    BigDecimal calculateAverageRating(@Param("restaurantId") Long restaurantId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.restaurant.id = :restaurantId")
    Long countByRestaurantId(@Param("restaurantId") Long restaurantId);
}
