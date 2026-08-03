package com.dineflow.dineflowbackend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FeedbackRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Long orderId;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "Rating must be at least 0")
    @DecimalMax(value = "5.0", message = "Rating must be at most 5")
    private BigDecimal rating;

    @Size(max = 2000, message = "Review must not exceed 2000 characters")
    private String review;

    @Min(value = 1) @Max(value = 5)
    private Integer foodQualityRating;

    @Min(value = 1) @Max(value = 5)
    private Integer serviceRating;

    @Min(value = 1) @Max(value = 5)
    private Integer ambienceRating;

    @Min(value = 1) @Max(value = 5)
    private Integer valueRating;

    private Boolean wouldRecommend;
}
