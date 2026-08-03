package com.dineflow.dineflowbackend.mapper;

import com.dineflow.dineflowbackend.dto.RestaurantRequest;
import com.dineflow.dineflowbackend.dto.RestaurantResponse;
import com.dineflow.dineflowbackend.entity.Restaurant;
import org.springframework.stereotype.Component;

@Component
public class RestaurantMapper {

    public Restaurant toEntity(RestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setCity(request.getCity());
        restaurant.setState(request.getState());
        restaurant.setZipCode(request.getZipCode());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());
        restaurant.setWebsite(request.getWebsite());
        restaurant.setLogoUrl(request.getLogoUrl());
        restaurant.setBannerUrl(request.getBannerUrl());
        restaurant.setMinOrderAmount(request.getMinOrderAmount());
        restaurant.setDeliveryFee(request.getDeliveryFee());
        restaurant.setTaxRate(request.getTaxRate());
        restaurant.setOpeningHours(request.getOpeningHours());
        restaurant.setClosingHours(request.getClosingHours());
        restaurant.setCuisineType(request.getCuisineType());
        if (request.getIsActive() != null) {
            restaurant.setIsActive(request.getIsActive());
        }
        return restaurant;
    }

    public RestaurantResponse toResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .state(restaurant.getState())
                .zipCode(restaurant.getZipCode())
                .phone(restaurant.getPhone())
                .email(restaurant.getEmail())
                .website(restaurant.getWebsite())
                .logoUrl(restaurant.getLogoUrl())
                .bannerUrl(restaurant.getBannerUrl())
                .avgRating(restaurant.getAvgRating())
                .totalReviews(restaurant.getTotalReviews())
                .isActive(restaurant.getIsActive())
                .minOrderAmount(restaurant.getMinOrderAmount())
                .deliveryFee(restaurant.getDeliveryFee())
                .taxRate(restaurant.getTaxRate())
                .openingHours(restaurant.getOpeningHours())
                .closingHours(restaurant.getClosingHours())
                .cuisineType(restaurant.getCuisineType())
                .createdAt(restaurant.getCreatedAt())
                .updatedAt(restaurant.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(Restaurant restaurant, RestaurantRequest request) {
        if (request.getName() != null) restaurant.setName(request.getName());
        if (request.getDescription() != null) restaurant.setDescription(request.getDescription());
        if (request.getAddress() != null) restaurant.setAddress(request.getAddress());
        if (request.getCity() != null) restaurant.setCity(request.getCity());
        if (request.getState() != null) restaurant.setState(request.getState());
        if (request.getZipCode() != null) restaurant.setZipCode(request.getZipCode());
        if (request.getPhone() != null) restaurant.setPhone(request.getPhone());
        if (request.getEmail() != null) restaurant.setEmail(request.getEmail());
        if (request.getWebsite() != null) restaurant.setWebsite(request.getWebsite());
        if (request.getLogoUrl() != null) restaurant.setLogoUrl(request.getLogoUrl());
        if (request.getBannerUrl() != null) restaurant.setBannerUrl(request.getBannerUrl());
        if (request.getMinOrderAmount() != null) restaurant.setMinOrderAmount(request.getMinOrderAmount());
        if (request.getDeliveryFee() != null) restaurant.setDeliveryFee(request.getDeliveryFee());
        if (request.getTaxRate() != null) restaurant.setTaxRate(request.getTaxRate());
        if (request.getOpeningHours() != null) restaurant.setOpeningHours(request.getOpeningHours());
        if (request.getClosingHours() != null) restaurant.setClosingHours(request.getClosingHours());
        if (request.getCuisineType() != null) restaurant.setCuisineType(request.getCuisineType());
        if (request.getIsActive() != null) restaurant.setIsActive(request.getIsActive());
    }
}
