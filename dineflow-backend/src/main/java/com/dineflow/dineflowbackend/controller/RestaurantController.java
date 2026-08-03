package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.RestaurantRequest;
import com.dineflow.dineflowbackend.dto.RestaurantResponse;
import com.dineflow.dineflowbackend.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(
            @Valid @RequestBody RestaurantRequest request) {
        RestaurantResponse restaurant = restaurantService.createRestaurant(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Restaurant created", restaurant));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success(restaurant));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAllRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine,
            @RequestParam(defaultValue = "false") boolean all) {
        List<RestaurantResponse> restaurants;
        if (name != null && !name.isEmpty()) {
            restaurants = restaurantService.searchByName(name);
        } else if (city != null && !city.isEmpty()) {
            restaurants = restaurantService.searchByCity(city);
        } else if (cuisine != null && !cuisine.isEmpty()) {
            restaurants = restaurantService.searchByCuisine(cuisine);
        } else if (all) {
            restaurants = restaurantService.getAllRestaurants();
        } else {
            restaurants = restaurantService.getActiveRestaurants();
        }
        return ResponseEntity.ok(ApiResponse.success(restaurants));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request) {
        RestaurantResponse restaurant = restaurantService.updateRestaurant(id, request);
        return ResponseEntity.ok(ApiResponse.success("Restaurant updated", restaurant));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant deleted", null));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> toggleActive(@PathVariable Long id) {
        RestaurantResponse restaurant = restaurantService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant status updated", restaurant));
    }
}
