package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.DashboardStats;
import com.dineflow.dineflowbackend.dto.OrderResponse;
import com.dineflow.dineflowbackend.dto.UserResponse;
import com.dineflow.dineflowbackend.entity.OrderStatus;
import com.dineflow.dineflowbackend.entity.User;
import com.dineflow.dineflowbackend.entity.UserRole;
import com.dineflow.dineflowbackend.repository.UserRepository;
import com.dineflow.dineflowbackend.service.DashboardService;
import com.dineflow.dineflowbackend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public AdminController(DashboardService dashboardService,
                           OrderService orderService,
                           UserRepository userRepository) {
        this.dashboardService = dashboardService;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard/{restaurantId}")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboard(@PathVariable Long restaurantId) {
        DashboardStats stats = dashboardService.getAdminDashboard(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllCustomers() {
        List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER)
                .collect(Collectors.toList());
        List<UserResponse> responses = customers.stream()
                .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getPhone(),
                        u.getRole(), u.getIsActive(), u.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/employees/{restaurantId}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getEmployees(@PathVariable Long restaurantId) {
        List<User> employees = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.STAFF || u.getRole() == UserRole.KITCHEN)
                .collect(Collectors.toList());
        List<UserResponse> responses = employees.stream()
                .map(u -> new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getPhone(),
                        u.getRole(), u.getIsActive(), u.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/reports/{restaurantId}/revenue")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getRevenueReport(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "7") int days) {
        Map<String, BigDecimal> revenueData = new HashMap<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);
            BigDecimal revenue = orderService.getOrdersByRestaurant(restaurantId).stream()
                    .filter(o -> o.getCreatedAt().isAfter(start) && o.getCreatedAt().isBefore(end))
                    .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                    .map(OrderResponse::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            revenueData.put(date.toString(), revenue);
        }
        return ResponseEntity.ok(ApiResponse.success(revenueData));
    }

    @GetMapping("/reports/{restaurantId}/orders")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getOrdersReport(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "7") int days) {
        Map<String, Integer> orderData = new HashMap<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);
            int count = (int) orderService.getOrdersByRestaurant(restaurantId).stream()
                    .filter(o -> o.getCreatedAt().isAfter(start) && o.getCreatedAt().isBefore(end))
                    .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                    .count();
            orderData.put(date.toString(), count);
        }
        return ResponseEntity.ok(ApiResponse.success(orderData));
    }

    @GetMapping("/analytics/{restaurantId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsSummary(@PathVariable Long restaurantId) {
        Map<String, Object> analytics = new HashMap<>();
        List<OrderResponse> allOrders = orderService.getOrdersByRestaurant(restaurantId);

        long totalOrders = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .count();
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(OrderResponse::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avgOrderValue = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        long cancelledOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                .count();
        double cancellationRate = totalOrders + cancelledOrders > 0
                ? (cancelledOrders * 100.0) / (totalOrders + cancelledOrders)
                : 0.0;

        analytics.put("totalOrders", totalOrders);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("avgOrderValue", avgOrderValue);
        analytics.put("cancelledOrders", cancelledOrders);
        analytics.put("cancellationRate", String.format("%.2f%%", cancellationRate));
        analytics.put("totalCustomers", userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER).count());

        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
