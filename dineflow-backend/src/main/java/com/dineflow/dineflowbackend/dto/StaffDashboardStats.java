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
public class StaffDashboardStats {

    private Integer assignedTables;
    private Integer activeOrders;
    private BigDecimal todaySales;
    private Integer todayCompleted;
}
