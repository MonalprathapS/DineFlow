package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByRestaurantIdAndIsActiveTrueOrderByDisplayOrderAsc(Long restaurantId);

    Page<Category> findByRestaurantId(Long restaurantId, Pageable pageable);

    Page<Category> findByRestaurantIdAndNameContainingIgnoreCase(Long restaurantId, String name, Pageable pageable);

    List<Category> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    Optional<Category> findByRestaurantIdAndName(Long restaurantId, String name);
}
