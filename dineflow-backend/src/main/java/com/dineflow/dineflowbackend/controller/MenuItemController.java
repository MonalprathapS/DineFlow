package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.MenuItemRequest;
import com.dineflow.dineflowbackend.dto.MenuItemResponse;
import com.dineflow.dineflowbackend.service.MenuItemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse menuItem = menuItemService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item created", menuItem));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable Long id) {
        MenuItemResponse menuItem = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success(menuItem));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getMenuItems(
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") boolean featured,
            @RequestParam(defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (search != null && !search.isEmpty()) {
            if (restaurantId != null) {
                Page<MenuItemResponse> menuPage = menuItemService.searchMenuByRestaurant(
                        restaurantId, search, page, size);
                return ResponseEntity.ok(ApiResponse.success(menuPage));
            }
            Page<MenuItemResponse> menuPage = menuItemService.searchMenuItems(search, page, size);
            return ResponseEntity.ok(ApiResponse.success(menuPage));
        }

        if (featured && restaurantId != null) {
            List<MenuItemResponse> menuItems = menuItemService.getFeaturedMenuByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success(menuItems));
        }

        if (categoryId != null) {
            List<MenuItemResponse> menuItems = menuItemService.getAvailableMenuByCategory(categoryId);
            return ResponseEntity.ok(ApiResponse.success(menuItems));
        }

        if (restaurantId != null) {
            if (paginated) {
                Page<MenuItemResponse> menuPage = menuItemService.getMenuByRestaurant(restaurantId, page, size);
                return ResponseEntity.ok(ApiResponse.success(menuPage));
            }
            List<MenuItemResponse> menuItems = menuItemService.getAvailableMenuByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success(menuItems));
        }

        return ResponseEntity.badRequest()
                .body(ApiResponse.error("restaurantId or categoryId is required"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse menuItem = menuItemService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated", menuItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted", null));
    }

    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> toggleAvailability(@PathVariable Long id) {
        MenuItemResponse menuItem = menuItemService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.success("Availability updated", menuItem));
    }

    @PatchMapping("/{id}/toggle-featured")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> toggleFeatured(@PathVariable Long id) {
        MenuItemResponse menuItem = menuItemService.toggleFeatured(id);
        return ResponseEntity.ok(ApiResponse.success("Featured status updated", menuItem));
    }
}
