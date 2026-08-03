package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.KitchenDashboardStats;
import com.dineflow.dineflowbackend.dto.OrderResponse;
import com.dineflow.dineflowbackend.dto.OrderStatusUpdateRequest;
import com.dineflow.dineflowbackend.entity.OrderStatus;
import com.dineflow.dineflowbackend.service.DashboardService;
import com.dineflow.dineflowbackend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {

    private final DashboardService dashboardService;
    private final OrderService orderService;

    public KitchenController(DashboardService dashboardService, OrderService orderService) {
        this.dashboardService = dashboardService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard/{restaurantId}")
    public ResponseEntity<ApiResponse<KitchenDashboardStats>> getDashboard(@PathVariable Long restaurantId) {
        KitchenDashboardStats stats = dashboardService.getKitchenDashboard(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/orders/{restaurantId}/new")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getNewOrders(@PathVariable Long restaurantId) {
        List<OrderResponse> accepted = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.ACCEPTED);
        List<OrderResponse> placed = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.PLACED);
        accepted.addAll(placed);
        return ResponseEntity.ok(ApiResponse.success(accepted));
    }

    @GetMapping("/orders/{restaurantId}/preparing")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getPreparingOrders(@PathVariable Long restaurantId) {
        List<OrderResponse> orders = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.PREPARING);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{restaurantId}/ready")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getReadyOrders(@PathVariable Long restaurantId) {
        List<OrderResponse> orders = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.READY);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{restaurantId}/today")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getTodayOrders(@PathVariable Long restaurantId) {
        List<OrderResponse> orders = orderService.getTodayOrders(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{restaurantId}/history")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getCompletedOrders(@PathVariable Long restaurantId) {
        List<OrderResponse> served = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.SERVED);
        List<OrderResponse> completed = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.COMPLETED);
        served.addAll(completed);
        return ResponseEntity.ok(ApiResponse.success(served));
    }

    @PatchMapping("/orders/{orderId}/start")
    public ResponseEntity<ApiResponse<OrderResponse>> startPreparing(@PathVariable Long orderId) {
        OrderResponse order = orderService.updateStatus(orderId, OrderStatus.PREPARING, null);
        return ResponseEntity.ok(ApiResponse.success("Order moved to preparing", order));
    }

    @PatchMapping("/orders/{orderId}/ready")
    public ResponseEntity<ApiResponse<OrderResponse>> markReady(@PathVariable Long orderId) {
        OrderResponse order = orderService.updateStatus(orderId, OrderStatus.READY, new OrderStatusUpdateRequest());
        return ResponseEntity.ok(ApiResponse.success("Order marked as ready", order));
    }

    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam(required = false) String reason) {
        var request = new OrderStatusUpdateRequest();
        request.setCancellationReason(reason);
        OrderResponse order = orderService.updateStatus(orderId, OrderStatus.CANCELLED, request);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", order));
    }
}
