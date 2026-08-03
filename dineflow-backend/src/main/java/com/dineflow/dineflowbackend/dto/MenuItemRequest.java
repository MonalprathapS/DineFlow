package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MenuItemRequest {

    @NotBlank(message = "Menu item name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String imageUrl;

    private Boolean isAvailable = true;

    private Boolean isVegetarian = false;

    private Boolean isVegan = false;

    private Integer preparationTime;

    private String allergens;

    private String ingredients;

    private Integer calories;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Boolean isFeatured = false;

    private Integer displayOrder = 0;
}
