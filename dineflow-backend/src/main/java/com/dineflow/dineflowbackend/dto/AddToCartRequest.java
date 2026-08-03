package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRequest {

    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Long tableId;

    @Positive(message = "Quantity must be positive")
    private Integer quantity = 1;

    private String specialInstructions;
}
