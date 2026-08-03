package com.dineflow.dineflowbackend.mapper;

import com.dineflow.dineflowbackend.dto.MenuItemRequest;
import com.dineflow.dineflowbackend.dto.MenuItemResponse;
import com.dineflow.dineflowbackend.entity.Category;
import com.dineflow.dineflowbackend.entity.MenuItem;
import com.dineflow.dineflowbackend.entity.Restaurant;
import com.dineflow.dineflowbackend.repository.CategoryRepository;
import com.dineflow.dineflowbackend.repository.RestaurantRepository;
import org.springframework.stereotype.Component;

@Component
public class MenuItemMapper {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;

    public MenuItemMapper(RestaurantRepository restaurantRepository, CategoryRepository categoryRepository) {
        this.restaurantRepository = restaurantRepository;
        this.categoryRepository = categoryRepository;
    }

    public MenuItem toEntity(MenuItemRequest request) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());
        if (request.getIsAvailable() != null) menuItem.setIsAvailable(request.getIsAvailable());
        if (request.getIsVegetarian() != null) menuItem.setIsVegetarian(request.getIsVegetarian());
        if (request.getIsVegan() != null) menuItem.setIsVegan(request.getIsVegan());
        menuItem.setPreparationTime(request.getPreparationTime());
        menuItem.setAllergens(request.getAllergens());
        menuItem.setIngredients(request.getIngredients());
        menuItem.setCalories(request.getCalories());
        if (request.getIsFeatured() != null) menuItem.setIsFeatured(request.getIsFeatured());
        if (request.getDisplayOrder() != null) menuItem.setDisplayOrder(request.getDisplayOrder());

        if (request.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + request.getRestaurantId()));
            menuItem.setRestaurant(restaurant);
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            menuItem.setCategory(category);
        }

        return menuItem;
    }

    public MenuItemResponse toResponse(MenuItem menuItem) {
        return MenuItemResponse.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .imageUrl(menuItem.getImageUrl())
                .isAvailable(menuItem.getIsAvailable())
                .isVegetarian(menuItem.getIsVegetarian())
                .isVegan(menuItem.getIsVegan())
                .preparationTime(menuItem.getPreparationTime())
                .allergens(menuItem.getAllergens())
                .ingredients(menuItem.getIngredients())
                .calories(menuItem.getCalories())
                .avgRating(menuItem.getAvgRating())
                .totalRatings(menuItem.getTotalRatings())
                .categoryId(menuItem.getCategory() != null ? menuItem.getCategory().getId() : null)
                .categoryName(menuItem.getCategory() != null ? menuItem.getCategory().getName() : null)
                .restaurantId(menuItem.getRestaurant() != null ? menuItem.getRestaurant().getId() : null)
                .restaurantName(menuItem.getRestaurant() != null ? menuItem.getRestaurant().getName() : null)
                .isFeatured(menuItem.getIsFeatured())
                .displayOrder(menuItem.getDisplayOrder())
                .createdAt(menuItem.getCreatedAt())
                .updatedAt(menuItem.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(MenuItem menuItem, MenuItemRequest request) {
        if (request.getName() != null) menuItem.setName(request.getName());
        if (request.getDescription() != null) menuItem.setDescription(request.getDescription());
        if (request.getPrice() != null) menuItem.setPrice(request.getPrice());
        if (request.getImageUrl() != null) menuItem.setImageUrl(request.getImageUrl());
        if (request.getIsAvailable() != null) menuItem.setIsAvailable(request.getIsAvailable());
        if (request.getIsVegetarian() != null) menuItem.setIsVegetarian(request.getIsVegetarian());
        if (request.getIsVegan() != null) menuItem.setIsVegan(request.getIsVegan());
        if (request.getPreparationTime() != null) menuItem.setPreparationTime(request.getPreparationTime());
        if (request.getAllergens() != null) menuItem.setAllergens(request.getAllergens());
        if (request.getIngredients() != null) menuItem.setIngredients(request.getIngredients());
        if (request.getCalories() != null) menuItem.setCalories(request.getCalories());
        if (request.getIsFeatured() != null) menuItem.setIsFeatured(request.getIsFeatured());
        if (request.getDisplayOrder() != null) menuItem.setDisplayOrder(request.getDisplayOrder());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            menuItem.setCategory(category);
        }
    }
}
