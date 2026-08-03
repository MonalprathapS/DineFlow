package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.OrderStatus;
import com.dineflow.dineflowbackend.entity.OrderType;
import com.dineflow.dineflowbackend.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long restaurantId;
    private String restaurantName;
    private Long tableId;
    private String tableNumber;
    private Long assignedWaiterId;
    private String assignedWaiterName;
    private OrderStatus status;
    private OrderType orderType;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private LocalDateTime acceptedAt;
    private LocalDateTime preparingAt;
    private LocalDateTime readyAt;
    private LocalDateTime servedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
