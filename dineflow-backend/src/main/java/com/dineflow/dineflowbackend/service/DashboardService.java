package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.*;
import com.dineflow.dineflowbackend.entity.*;
import com.dineflow.dineflowbackend.repository.OrderItemRepository;
import com.dineflow.dineflowbackend.repository.OrderRepository;
import com.dineflow.dineflowbackend.repository.RestaurantTableRepository;
import com.dineflow.dineflowbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;

    public DashboardService(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            RestaurantTableRepository tableRepository,
                            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    public DashboardStats getAdminDashboard(Long restaurantId) {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime weekStart = LocalDate.now().minusDays(7).atStartOfDay();
        LocalDateTime monthStart = LocalDate.now().minusDays(30).atStartOfDay();

        BigDecimal todayRevenue = orderRepository.calculateRevenue(restaurantId, todayStart, todayEnd);
        BigDecimal weeklyRevenue = orderRepository.calculateRevenue(restaurantId, weekStart, todayEnd);
        BigDecimal monthlyRevenue = orderRepository.calculateRevenue(restaurantId, monthStart, todayEnd);

        int todayOrders = orderRepository.findByRestaurantIdAndDateRange(restaurantId, todayStart, todayEnd).size();
        int occupiedTables = (int) tableRepository.countByRestaurantIdAndStatus(restaurantId, TableStatus.OCCUPIED);
        int availableTables = (int) tableRepository.countByRestaurantIdAndStatus(restaurantId, TableStatus.AVAILABLE);

        int preparingOrders = orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.PREPARING).intValue();
        int readyOrders = orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.READY).intValue();
        int completedOrders = orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.COMPLETED).intValue();

        List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER)
                .toList();

        List<TopSellingItem> topItems = getTopSellingItems(restaurantId);

        return DashboardStats.builder()
                .todayRevenue(todayRevenue)
                .todayOrders(todayOrders)
                .totalCustomers(customers.size())
                .occupiedTables(occupiedTables)
                .availableTables(availableTables)
                .preparingOrders(preparingOrders)
                .readyOrders(readyOrders)
                .completedOrders(completedOrders)
                .topSellingItems(topItems)
                .weeklyRevenue(weeklyRevenue)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    public KitchenDashboardStats getKitchenDashboard(Long restaurantId) {
        int newOrders = orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.PLACED).intValue()
                + orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.ACCEPTED).intValue();
        int preparing = orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.PREPARING).intValue();
        int ready = orderRepository.countByRestaurantIdAndStatus(restaurantId, OrderStatus.READY).intValue();

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);
        int completedToday = (int) orderRepository.findByRestaurantIdAndDateRange(restaurantId, todayStart, todayEnd)
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED || o.getStatus() == OrderStatus.SERVED)
                .count();

        return KitchenDashboardStats.builder()
                .newOrders(newOrders)
                .preparingOrders(preparing)
                .readyOrders(ready)
                .completedToday(completedToday)
                .build();
    }

    public StaffDashboardStats getStaffDashboard(Long staffId, Long restaurantId) {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);

        int assignedTables = tableRepository.findByAssignedWaiterId(staffId).size();

        List<Order> staffOrders = orderRepository.findByAssignedWaiterIdOrderByCreatedAtDesc(staffId);
        int activeOrders = (int) staffOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.COMPLETED && o.getStatus() != OrderStatus.CANCELLED)
                .count();

        BigDecimal todaySales = staffOrders.stream()
                .filter(o -> o.getCreatedAt().isAfter(todayStart) && o.getCreatedAt().isBefore(todayEnd))
                .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int todayCompleted = (int) staffOrders.stream()
                .filter(o -> o.getCreatedAt().isAfter(todayStart) && o.getCreatedAt().isBefore(todayEnd))
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED || o.getStatus() == OrderStatus.SERVED)
                .count();

        return StaffDashboardStats.builder()
                .assignedTables(assignedTables)
                .activeOrders(activeOrders)
                .todaySales(todaySales)
                .todayCompleted(todayCompleted)
                .build();
    }

    private List<TopSellingItem> getTopSellingItems(Long restaurantId) {
        List<Object[]> results = orderItemRepository.findTopSellingItems(restaurantId);
        List<TopSellingItem> items = new ArrayList<>();
        for (int i = 0; i < Math.min(5, results.size()); i++) {
            Object[] row = results.get(i);
            Long menuItemId = ((Number) row[0]).longValue();
            Long totalQty = ((Number) row[1]).longValue();
            String name = orderItemRepository.findById(menuItemId)
                    .map(OrderItem::getMenuItemName)
                    .orElse("Item " + menuItemId);
            items.add(TopSellingItem.builder()
                    .menuItemId(menuItemId)
                    .menuItemName(name)
                    .menuItemImage(null)
                    .totalUnits(totalQty)
                    .build());
        }
        if (items.isEmpty()) {
            for (int i = 1; i <= 3; i++) {
                items.add(TopSellingItem.builder()
                        .menuItemId((long) i)
                        .menuItemName("Sample Item " + i)
                        .totalUnits(0L)
                        .build());
            }
        }
        return items;
    }
}
