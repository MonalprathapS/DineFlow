package com.dineflow.dineflowbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private String menuItemImage;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String specialInstructions;
}
