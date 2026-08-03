package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RestaurantRequest {

    @NotBlank(message = "Restaurant name is required")
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

    private BigDecimal minOrderAmount;

    private BigDecimal deliveryFee;

    private String taxRate;

    private String openingHours;

    private String closingHours;

    private String cuisineType;

    private Boolean isActive = true;
}
