package com.dineflow.dineflowbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Long restaurantId;
    private String restaurantName;
    private Integer displayOrder;
    private Boolean isActive;
    private Integer menuItemCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
