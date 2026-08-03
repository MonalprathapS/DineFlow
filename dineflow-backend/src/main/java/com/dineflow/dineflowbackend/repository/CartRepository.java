package com.dineflow.dineflowbackend.repository;

import com.dineflow.dineflowbackend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByCustomerId(Long customerId);

    Optional<Cart> findByCustomerIdAndRestaurantId(Long customerId, Long restaurantId);

    Optional<Cart> findByTableId(Long tableId);

    void deleteByCustomerId(Long customerId);
}
