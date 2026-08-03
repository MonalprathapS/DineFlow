package com.dineflow.dineflowbackend.mapper;

import com.dineflow.dineflowbackend.dto.TableRequest;
import com.dineflow.dineflowbackend.dto.TableResponse;
import com.dineflow.dineflowbackend.entity.Restaurant;
import com.dineflow.dineflowbackend.entity.RestaurantTable;
import com.dineflow.dineflowbackend.entity.User;
import com.dineflow.dineflowbackend.repository.RestaurantRepository;
import com.dineflow.dineflowbackend.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TableMapper {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public TableMapper(RestaurantRepository restaurantRepository, UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    public RestaurantTable toEntity(TableRequest request) {
        RestaurantTable table = new RestaurantTable();
        table.setTableNumber(request.getTableNumber());
        table.setCapacity(request.getCapacity());
        table.setStatus(request.getStatus());
        if (request.getQrCode() != null) {
            table.setQrCode(request.getQrCode());
        } else {
            table.setQrCode(UUID.randomUUID().toString());
        }
        table.setQrCodeUrl(request.getQrCodeUrl());

        if (request.getRestaurantId() != null) {
            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + request.getRestaurantId()));
            table.setRestaurant(restaurant);
        }

        if (request.getAssignedWaiterId() != null) {
            User waiter = userRepository.findById(request.getAssignedWaiterId())
                    .orElseThrow(() -> new RuntimeException("Waiter not found with id: " + request.getAssignedWaiterId()));
            table.setAssignedWaiter(waiter);
        }

        table.setLocation(request.getLocation());
        table.setNotes(request.getNotes());
        return table;
    }

    public TableResponse toResponse(RestaurantTable table) {
        return TableResponse.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .capacity(table.getCapacity())
                .status(table.getStatus())
                .qrCode(table.getQrCode())
                .qrCodeUrl(table.getQrCodeUrl())
                .restaurantId(table.getRestaurant() != null ? table.getRestaurant().getId() : null)
                .restaurantName(table.getRestaurant() != null ? table.getRestaurant().getName() : null)
                .assignedWaiterId(table.getAssignedWaiter() != null ? table.getAssignedWaiter().getId() : null)
                .assignedWaiterName(table.getAssignedWaiter() != null ? table.getAssignedWaiter().getName() : null)
                .location(table.getLocation())
                .notes(table.getNotes())
                .createdAt(table.getCreatedAt())
                .updatedAt(table.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(RestaurantTable table, TableRequest request) {
        if (request.getTableNumber() != null) table.setTableNumber(request.getTableNumber());
        if (request.getCapacity() != null) table.setCapacity(request.getCapacity());
        if (request.getStatus() != null) table.setStatus(request.getStatus());
        if (request.getQrCode() != null) table.setQrCode(request.getQrCode());
        if (request.getQrCodeUrl() != null) table.setQrCodeUrl(request.getQrCodeUrl());
        if (request.getAssignedWaiterId() != null) {
            User waiter = userRepository.findById(request.getAssignedWaiterId())
                    .orElseThrow(() -> new RuntimeException("Waiter not found with id: " + request.getAssignedWaiterId()));
            table.setAssignedWaiter(waiter);
        }
        if (request.getLocation() != null) table.setLocation(request.getLocation());
        if (request.getNotes() != null) table.setNotes(request.getNotes());
    }
}
