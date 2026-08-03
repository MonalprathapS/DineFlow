package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.RestaurantTable;
import com.dineflow.dineflowbackend.entity.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    List<RestaurantTable> findByRestaurantId(Long restaurantId);

    List<RestaurantTable> findByRestaurantIdAndStatus(Long restaurantId, TableStatus status);

    List<RestaurantTable> findByAssignedWaiterId(Long waiterId);

    Optional<RestaurantTable> findByQrCode(String qrCode);

    Optional<RestaurantTable> findByRestaurantIdAndTableNumber(Long restaurantId, String tableNumber);

    @Query("SELECT COUNT(t) FROM RestaurantTable t WHERE t.restaurant.id = :restaurantId AND t.status = :status")
    long countByRestaurantIdAndStatus(Long restaurantId, TableStatus status);
}
