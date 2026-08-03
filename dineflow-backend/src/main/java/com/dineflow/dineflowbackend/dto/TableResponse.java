package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TableResponse {

    private Long id;
    private String tableNumber;
    private Integer capacity;
    private TableStatus status;
    private String qrCode;
    private String qrCodeUrl;
    private Long restaurantId;
    private String restaurantName;
    private Long assignedWaiterId;
    private String assignedWaiterName;
    private String location;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
