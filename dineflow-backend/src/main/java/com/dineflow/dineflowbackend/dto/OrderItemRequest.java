package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {

    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;

    @Positive(message = "Quantity must be positive")
    private Integer quantity = 1;

    private String specialInstructions;
}
