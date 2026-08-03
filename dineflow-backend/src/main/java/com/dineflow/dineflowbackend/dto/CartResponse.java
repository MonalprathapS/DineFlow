package com.dineflow.dineflowbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private Long restaurantId;
    private String restaurantName;
    private Long tableId;
    private String tableNumber;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private Integer totalItems;
    private List<CartItemResponse> items;
}
