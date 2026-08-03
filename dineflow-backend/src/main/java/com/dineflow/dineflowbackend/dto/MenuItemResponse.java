package com.dineflow.dineflowbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class MenuItemResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private Integer preparationTime;
    private String allergens;
    private String ingredients;
    private Integer calories;
    private BigDecimal avgRating;
    private Integer totalRatings;
    private Long categoryId;
    private String categoryName;
    private Long restaurantId;
    private String restaurantName;
    private Boolean isFeatured;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
