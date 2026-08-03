package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);

    List<MenuItem> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    List<MenuItem> findByRestaurantIdAndIsFeaturedTrueAndIsAvailableTrue(Long restaurantId);

    Page<MenuItem> findByRestaurantId(Long restaurantId, Pageable pageable);

    Page<MenuItem> findByNameContainingIgnoreCaseAndIsAvailableTrue(String name, Pageable pageable);

    @Query("SELECT m FROM MenuItem m WHERE m.restaurant.id = :restaurantId AND LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<MenuItem> searchByRestaurantAndKeyword(@Param("restaurantId") Long restaurantId,
                                                 @Param("keyword") String keyword,
                                                 Pageable pageable);

    Optional<MenuItem> findByRestaurantIdAndName(Long restaurantId, String name);

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi JOIN oi.menuItem m WHERE m.id = :menuItemId")
    Long getTotalUnitsSold(@Param("menuItemId") Long menuItemId);
}
