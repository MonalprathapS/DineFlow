package com.dineflow.dineflowbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class KitchenDashboardStats {

    private Integer newOrders;
    private Integer preparingOrders;
    private Integer readyOrders;
    private Integer completedToday;
}
