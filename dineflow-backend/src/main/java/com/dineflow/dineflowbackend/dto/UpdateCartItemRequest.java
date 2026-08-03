package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCartItemRequest {

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private String specialInstructions;
}
