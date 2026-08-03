package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.OrderResponse;
import com.dineflow.dineflowbackend.dto.OrderStatusUpdateRequest;
import com.dineflow.dineflowbackend.dto.StaffDashboardStats;
import com.dineflow.dineflowbackend.dto.TableResponse;
import com.dineflow.dineflowbackend.entity.OrderStatus;
import com.dineflow.dineflowbackend.entity.PaymentStatus;
import com.dineflow.dineflowbackend.service.DashboardService;
import com.dineflow.dineflowbackend.service.OrderService;
import com.dineflow.dineflowbackend.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final TableService tableService;

    public StaffController(DashboardService dashboardService,
                           OrderService orderService,
                           TableService tableService) {
        this.dashboardService = dashboardService;
        this.orderService = orderService;
        this.tableService = tableService;
    }

    @GetMapping("/dashboard/{staffId}/{restaurantId}")
    public ResponseEntity<ApiResponse<StaffDashboardStats>> getDashboard(
            @PathVariable Long staffId,
            @PathVariable Long restaurantId) {
        StaffDashboardStats stats = dashboardService.getStaffDashboard(staffId, restaurantId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/tables/{staffId}/assigned")
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAssignedTables(@PathVariable Long staffId) {
        List<TableResponse> tables = tableService.getTablesByWaiter(staffId);
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/orders/{staffId}/today")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getTodayOrders(
            @PathVariable Long staffId,
            @RequestParam Long restaurantId) {
        List<OrderResponse> orders = orderService.getOrdersByWaiter(staffId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/orders/{restaurantId}/active")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getActiveOrders(@PathVariable Long restaurantId) {
        List<OrderResponse> placed = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.PLACED);
        List<OrderResponse> accepted = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.ACCEPTED);
        List<OrderResponse> preparing = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.PREPARING);
        List<OrderResponse> ready = orderService.getOrdersByRestaurantAndStatus(restaurantId, OrderStatus.READY);
        placed.addAll(accepted);
        placed.addAll(preparing);
        placed.addAll(ready);
        return ResponseEntity.ok(ApiResponse.success(placed));
    }

    @GetMapping("/orders/{orderId}/bill")
    public ResponseEntity<ApiResponse<BigDecimal>> generateBill(@PathVariable Long orderId) {
        BigDecimal bill = orderService.generateBill(orderId);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    @PatchMapping("/orders/{orderId}/serve")
    public ResponseEntity<ApiResponse<OrderResponse>> markServed(@PathVariable Long orderId) {
        OrderResponse order = orderService.updateStatus(orderId, OrderStatus.SERVED, null);
        return ResponseEntity.ok(ApiResponse.success("Order marked as served", order));
    }

    @PatchMapping("/orders/{orderId}/complete")
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(@PathVariable Long orderId) {
        OrderResponse order = orderService.updateStatus(orderId, OrderStatus.COMPLETED, null);
        return ResponseEntity.ok(ApiResponse.success("Order completed", order));
    }

    @PatchMapping("/orders/{orderId}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(@PathVariable Long orderId) {
        OrderResponse order = orderService.updateStatus(orderId, OrderStatus.ACCEPTED, null);
        return ResponseEntity.ok(ApiResponse.success("Order accepted", order));
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

    @PatchMapping("/orders/{orderId}/assign/{staffId}")
    public ResponseEntity<ApiResponse<OrderResponse>> assignToStaff(
            @PathVariable Long orderId,
            @PathVariable Long staffId) {
        OrderResponse order = orderService.assignWaiter(orderId, staffId);
        return ResponseEntity.ok(ApiResponse.success("Staff assigned", order));
    }

    @PatchMapping("/orders/{orderId}/mark-paid")
    public ResponseEntity<ApiResponse<OrderResponse>> markAsPaid(
            @PathVariable Long orderId,
            @RequestParam(required = false, defaultValue = "CASH") String paymentMethod,
            @RequestParam(required = false) String transactionId) {
        OrderResponse order = orderService.updatePayment(orderId, PaymentStatus.PAID, transactionId, paymentMethod);
        return ResponseEntity.ok(ApiResponse.success("Payment marked as received", order));
    }
}
