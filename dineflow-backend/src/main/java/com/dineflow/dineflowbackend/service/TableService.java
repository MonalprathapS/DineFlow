package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.TableRequest;
import com.dineflow.dineflowbackend.dto.TableResponse;
import com.dineflow.dineflowbackend.entity.RestaurantTable;
import com.dineflow.dineflowbackend.entity.TableStatus;
import com.dineflow.dineflowbackend.entity.User;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.mapper.TableMapper;
import com.dineflow.dineflowbackend.repository.RestaurantTableRepository;
import com.dineflow.dineflowbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {

    private final RestaurantTableRepository tableRepository;
    private final TableMapper tableMapper;
    private final UserRepository userRepository;

    public TableService(RestaurantTableRepository tableRepository, TableMapper tableMapper,
                        UserRepository userRepository) {
        this.tableRepository = tableRepository;
        this.tableMapper = tableMapper;
        this.userRepository = userRepository;
    }

    public TableResponse createTable(TableRequest request) {
        RestaurantTable table = tableMapper.toEntity(request);
        RestaurantTable saved = tableRepository.save(table);
        return tableMapper.toResponse(saved);
    }

    public TableResponse getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        return tableMapper.toResponse(table);
    }

    public List<TableResponse> getTablesByRestaurant(Long restaurantId) {
        return tableRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(tableMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<TableResponse> getTablesByRestaurantAndStatus(Long restaurantId, TableStatus status) {
        return tableRepository.findByRestaurantIdAndStatus(restaurantId, status)
                .stream()
                .map(tableMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<TableResponse> getTablesByWaiter(Long waiterId) {
        return tableRepository.findByAssignedWaiterId(waiterId)
                .stream()
                .map(tableMapper::toResponse)
                .collect(Collectors.toList());
    }

    public TableResponse getTableByQrCode(String qrCode) {
        RestaurantTable table = tableRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with QR code: " + qrCode));
        return tableMapper.toResponse(table);
    }

    public TableResponse updateTable(Long id, TableRequest request) {
        RestaurantTable existing = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        tableMapper.updateEntityFromRequest(existing, request);
        return tableMapper.toResponse(tableRepository.save(existing));
    }

    public void deleteTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        tableRepository.delete(table);
    }

    public TableResponse assignWaiter(Long tableId, Long waiterId) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));
        User waiter = userRepository.findById(waiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Waiter not found with id: " + waiterId));
        table.setAssignedWaiter(waiter);
        return tableMapper.toResponse(tableRepository.save(table));
    }

    public TableResponse updateStatus(Long tableId, TableStatus status) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));
        table.setStatus(status);
        return tableMapper.toResponse(tableRepository.save(table));
    }

    public long countByStatus(Long restaurantId, TableStatus status) {
        return tableRepository.countByRestaurantIdAndStatus(restaurantId, status);
    }
}
