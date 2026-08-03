package com.dineflow.dineflowbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(length = 2000)
    private String review;

    private Integer foodQualityRating;
    private Integer serviceRating;
    private Integer ambienceRating;
    private Integer valueRating;

    private Boolean wouldRecommend = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
