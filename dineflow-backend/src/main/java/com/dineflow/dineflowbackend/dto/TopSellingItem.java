package com.dineflow.dineflowbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TopSellingItem {

    private Long menuItemId;
    private String menuItemName;
    private String menuItemImage;
    private Long totalUnits;
}
