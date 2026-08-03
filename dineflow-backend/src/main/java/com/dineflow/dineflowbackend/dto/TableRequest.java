package com.dineflow.dineflowbackend.dto;

import com.dineflow.dineflowbackend.entity.TableStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TableRequest {

    @NotBlank(message = "Table number is required")
    private String tableNumber;

    private Integer capacity;

    private TableStatus status = TableStatus.AVAILABLE;

    private String qrCode;

    private String qrCodeUrl;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Long assignedWaiterId;

    private String location;

    private String notes;
}
