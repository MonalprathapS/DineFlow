package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.OrderType;
import com.dineflow.dineflowbackend.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderRequest {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Long tableId;

    private Long cartId;

    private OrderType orderType = OrderType.DINE_IN;

    private String paymentMethod;

    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String transactionId;

    private Long couponId;

    private String specialInstructions;

    private List<OrderItemRequest> items;
}
