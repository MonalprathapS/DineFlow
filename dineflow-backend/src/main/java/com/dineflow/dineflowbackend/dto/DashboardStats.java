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
public class DashboardStats {

    private BigDecimal todayRevenue;
    private Integer todayOrders;
    private Integer totalCustomers;
    private Integer occupiedTables;
    private Integer availableTables;
    private Integer preparingOrders;
    private Integer readyOrders;
    private Integer completedOrders;
    private List<TopSellingItem> topSellingItems;
    private BigDecimal weeklyRevenue;
    private BigDecimal monthlyRevenue;
}
