package com.dineflow.dineflowbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @Column(nullable = false)
    private Boolean isVegetarian = false;

    @Column(nullable = false)
    private Boolean isVegan = false;

    private Integer preparationTime;

    private String allergens;

    private String ingredients;

    private Integer calories;

    @Column(precision = 3, scale = 2)
    private BigDecimal avgRating = BigDecimal.ZERO;

    private Integer totalRatings = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false)
    private Boolean isFeatured = false;

    @Column(nullable = false)
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
