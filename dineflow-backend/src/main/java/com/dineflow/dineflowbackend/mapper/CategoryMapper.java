package com.dineflow.dineflowbackend.mapper;

import com.dineflow.dineflowbackend.dto.CategoryRequest;
import com.dineflow.dineflowbackend.dto.CategoryResponse;
import com.dineflow.dineflowbackend.entity.Category;
import com.dineflow.dineflowbackend.entity.Restaurant;
import com.dineflow.dineflowbackend.repository.RestaurantRepository;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    private final RestaurantRepository restaurantRepository;

    public CategoryMapper(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        if (request.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + request.getRestaurantId()));
            category.setRestaurant(restaurant);
        }

        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) category.setIsActive(request.getIsActive());
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .restaurantId(category.getRestaurant() != null ? category.getRestaurant().getId() : null)
                .restaurantName(category.getRestaurant() != null ? category.getRestaurant().getName() : null)
                .displayOrder(category.getDisplayOrder())
                .isActive(category.getIsActive())
                .menuItemCount(category.getMenuItems() != null ? category.getMenuItems().size() : 0)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(Category category, CategoryRequest request) {
        if (request.getName() != null) category.setName(request.getName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getImageUrl() != null) category.setImageUrl(request.getImageUrl());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) category.setIsActive(request.getIsActive());
    }
}
