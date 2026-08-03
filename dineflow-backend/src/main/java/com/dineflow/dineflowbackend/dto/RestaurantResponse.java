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
public class RestaurantResponse {

    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String email;
    private String website;
    private String logoUrl;
    private String bannerUrl;
    private BigDecimal avgRating;
    private Integer totalReviews;
    private Boolean isActive;
    private BigDecimal minOrderAmount;
    private BigDecimal deliveryFee;
    private String taxRate;
    private String openingHours;
    private String closingHours;
    private String cuisineType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
