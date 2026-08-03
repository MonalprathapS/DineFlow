package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    private String imageUrl;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Integer displayOrder = 0;

    private Boolean isActive = true;
}
