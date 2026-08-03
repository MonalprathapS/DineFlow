package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.*;
import com.dineflow.dineflowbackend.entity.OrderStatus;
import com.dineflow.dineflowbackend.entity.PaymentStatus;
import com.dineflow.dineflowbackend.service.OrderService;
import com.dineflow.dineflowbackend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    public OrderController(OrderService orderService, JwtUtil jwtUtil) {
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        OrderResponse order = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created", order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(required = false) Long waiterId,
            @RequestParam(required = false) Long tableId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "false") boolean today,
            @RequestParam(defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {

        if (customerId == null && httpRequest != null) {
            String role = extractRole(httpRequest);
            if ("CUSTOMER".equals(role)) {
                customerId = extractUserId(httpRequest);
            }
        }

        if (customerId != null) {
            List<OrderResponse> orders = orderService.getOrdersByCustomer(customerId);
            return ResponseEntity.ok(ApiResponse.success(orders));
        }

        if (waiterId != null) {
            List<OrderResponse> orders = orderService.getOrdersByWaiter(waiterId);
            return ResponseEntity.ok(ApiResponse.success(orders));
        }

        if (tableId != null) {
            List<OrderResponse> orders = orderService.getOrdersByTable(tableId);
            return ResponseEntity.ok(ApiResponse.success(orders));
        }

        if (restaurantId != null) {
            if (today) {
                List<OrderResponse> orders = orderService.getTodayOrders(restaurantId);
                return ResponseEntity.ok(ApiResponse.success(orders));
            }
            if (status != null) {
                List<OrderResponse> orders = orderService.getOrdersByRestaurantAndStatus(restaurantId, status);
                return ResponseEntity.ok(ApiResponse.success(orders));
            }
            if (paginated) {
                Page<OrderResponse> orderPage = orderService.getOrdersByRestaurantPaged(restaurantId, page, size);
                return ResponseEntity.ok(ApiResponse.success(orderPage));
            }
            List<OrderResponse> orders = orderService.getOrdersByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success(orders));
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("customerId, restaurantId, waiterId, or tableId is required"));
    }

    private String extractRole(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractRole(token);
        }
        return null;
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status,
            @RequestBody(required = false) OrderStatusUpdateRequest request) {
        OrderResponse order = orderService.updateStatus(orderId, status, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
    }

    @PatchMapping("/{orderId}/assign-waiter/{waiterId}")
    public ResponseEntity<ApiResponse<OrderResponse>> assignWaiter(
            @PathVariable Long orderId,
            @PathVariable Long waiterId) {
        OrderResponse order = orderService.assignWaiter(orderId, waiterId);
        return ResponseEntity.ok(ApiResponse.success("Waiter assigned", order));
    }

    @PatchMapping("/{orderId}/payment")
    public ResponseEntity<ApiResponse<OrderResponse>> updatePayment(
            @PathVariable Long orderId,
            @RequestParam PaymentStatus paymentStatus,
            @RequestParam(required = false) String transactionId,
            @RequestParam(required = false) String paymentMethod) {
        OrderResponse order = orderService.updatePayment(orderId, paymentStatus, transactionId, paymentMethod);
        return ResponseEntity.ok(ApiResponse.success("Payment updated", order));
    }

    @GetMapping("/{orderId}/bill")
    public ResponseEntity<ApiResponse<BigDecimal>> generateBill(@PathVariable Long orderId) {
        BigDecimal bill = orderService.generateBill(orderId);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }
}
