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
public class FeedbackResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private Long restaurantId;
    private String restaurantName;
    private Long orderId;
    private String orderNumber;
    private BigDecimal rating;
    private String review;
    private Integer foodQualityRating;
    private Integer serviceRating;
    private Integer ambienceRating;
    private Integer valueRating;
    private Boolean wouldRecommend;
    private LocalDateTime createdAt;
}
