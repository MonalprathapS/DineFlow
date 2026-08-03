package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.TableRequest;
import com.dineflow.dineflowbackend.dto.TableResponse;
import com.dineflow.dineflowbackend.entity.TableStatus;
import com.dineflow.dineflowbackend.service.TableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TableResponse>> createTable(@Valid @RequestBody TableRequest request) {
        TableResponse table = tableService.createTable(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Table created", table));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>> getTableById(@PathVariable Long id) {
        TableResponse table = tableService.getTableById(id);
        return ResponseEntity.ok(ApiResponse.success(table));
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<ApiResponse<TableResponse>> getTableByQrCode(@PathVariable String qrCode) {
        TableResponse table = tableService.getTableByQrCode(qrCode);
        return ResponseEntity.ok(ApiResponse.success(table));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TableResponse>>> getTables(
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(required = false) Long waiterId,
            @RequestParam(required = false) TableStatus status) {
        List<TableResponse> tables;
        if (waiterId != null) {
            tables = tableService.getTablesByWaiter(waiterId);
        } else if (restaurantId != null && status != null) {
            tables = tableService.getTablesByRestaurantAndStatus(restaurantId, status);
        } else if (restaurantId != null) {
            tables = tableService.getTablesByRestaurant(restaurantId);
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("restaurantId or waiterId is required"));
        }
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/restaurant/{restaurantId}/counts")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getTableCounts(@PathVariable Long restaurantId) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("available", tableService.countByStatus(restaurantId, TableStatus.AVAILABLE));
        counts.put("occupied", tableService.countByStatus(restaurantId, TableStatus.OCCUPIED));
        counts.put("reserved", tableService.countByStatus(restaurantId, TableStatus.RESERVED));
        counts.put("cleaning", tableService.countByStatus(restaurantId, TableStatus.CLEANING));
        return ResponseEntity.ok(ApiResponse.success(counts));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TableResponse>> updateTable(
            @PathVariable Long id,
            @Valid @RequestBody TableRequest request) {
        TableResponse table = tableService.updateTable(id, request);
        return ResponseEntity.ok(ApiResponse.success("Table updated", table));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.success("Table deleted", null));
    }

    @PatchMapping("/{tableId}/assign-waiter/{waiterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TableResponse>> assignWaiter(
            @PathVariable Long tableId,
            @PathVariable Long waiterId) {
        TableResponse table = tableService.assignWaiter(tableId, waiterId);
        return ResponseEntity.ok(ApiResponse.success("Waiter assigned", table));
    }

    @PatchMapping("/{tableId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TableResponse>> updateStatus(
            @PathVariable Long tableId,
            @RequestParam TableStatus status) {
        TableResponse table = tableService.updateStatus(tableId, status);
        return ResponseEntity.ok(ApiResponse.success("Table status updated", table));
    }
}
