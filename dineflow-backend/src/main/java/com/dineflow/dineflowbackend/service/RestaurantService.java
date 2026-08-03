package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.RestaurantRequest;
import com.dineflow.dineflowbackend.dto.RestaurantResponse;
import com.dineflow.dineflowbackend.entity.Restaurant;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.mapper.RestaurantMapper;
import com.dineflow.dineflowbackend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public RestaurantService(RestaurantRepository restaurantRepository, RestaurantMapper restaurantMapper) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantMapper = restaurantMapper;
    }

    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        Restaurant restaurant = restaurantMapper.toEntity(request);
        Restaurant saved = restaurantRepository.save(restaurant);
        return restaurantMapper.toResponse(saved);
    }

    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return restaurantMapper.toResponse(restaurant);
    }

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getActiveRestaurants() {
        return restaurantRepository.findByIsActiveTrue()
                .stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> searchByName(String name) {
        return restaurantRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name)
                .stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> searchByCity(String city) {
        return restaurantRepository.findByCityContainingIgnoreCaseAndIsActiveTrue(city)
                .stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> searchByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineTypeContainingIgnoreCaseAndIsActiveTrue(cuisine)
                .stream()
                .map(restaurantMapper::toResponse)
                .collect(Collectors.toList());
    }

    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant existing = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurantMapper.updateEntityFromRequest(existing, request);
        Restaurant updated = restaurantRepository.save(existing);
        return restaurantMapper.toResponse(updated);
    }

    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurantRepository.delete(restaurant);
    }

    public RestaurantResponse toggleActive(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurant.setIsActive(!restaurant.getIsActive());
        return restaurantMapper.toResponse(restaurantRepository.save(restaurant));
    }
}
