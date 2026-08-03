package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.MenuItemRequest;
import com.dineflow.dineflowbackend.dto.MenuItemResponse;
import com.dineflow.dineflowbackend.entity.MenuItem;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.mapper.MenuItemMapper;
import com.dineflow.dineflowbackend.repository.MenuItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final MenuItemMapper menuItemMapper;

    public MenuItemService(MenuItemRepository menuItemRepository, MenuItemMapper menuItemMapper) {
        this.menuItemRepository = menuItemRepository;
        this.menuItemMapper = menuItemMapper;
    }

    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        MenuItem menuItem = menuItemMapper.toEntity(request);
        return menuItemMapper.toResponse(menuItemRepository.save(menuItem));
    }

    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return menuItemMapper.toResponse(menuItem);
    }

    public List<MenuItemResponse> getAvailableMenuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId)
                .stream()
                .map(menuItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<MenuItemResponse> getAvailableMenuByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryIdAndIsAvailableTrue(categoryId)
                .stream()
                .map(menuItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<MenuItemResponse> getFeaturedMenuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndIsFeaturedTrueAndIsAvailableTrue(restaurantId)
                .stream()
                .map(menuItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Page<MenuItemResponse> getMenuByRestaurant(Long restaurantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MenuItem> menuPage = menuItemRepository.findByRestaurantId(restaurantId, pageable);
        return menuPage.map(menuItemMapper::toResponse);
    }

    public Page<MenuItemResponse> searchMenuItems(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MenuItem> menuPage = menuItemRepository.findByNameContainingIgnoreCaseAndIsAvailableTrue(
                keyword, pageable);
        return menuPage.map(menuItemMapper::toResponse);
    }

    public Page<MenuItemResponse> searchMenuByRestaurant(Long restaurantId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MenuItem> menuPage = menuItemRepository.searchByRestaurantAndKeyword(
                restaurantId, keyword, pageable);
        return menuPage.map(menuItemMapper::toResponse);
    }

    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        menuItemMapper.updateEntityFromRequest(existing, request);
        return menuItemMapper.toResponse(menuItemRepository.save(existing));
    }

    public void deleteMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        menuItemRepository.delete(menuItem);
    }

    public MenuItemResponse toggleAvailability(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        menuItem.setIsAvailable(!menuItem.getIsAvailable());
        return menuItemMapper.toResponse(menuItemRepository.save(menuItem));
    }

    public MenuItemResponse toggleFeatured(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        menuItem.setIsFeatured(!menuItem.getIsFeatured());
        return menuItemMapper.toResponse(menuItemRepository.save(menuItem));
    }
}
