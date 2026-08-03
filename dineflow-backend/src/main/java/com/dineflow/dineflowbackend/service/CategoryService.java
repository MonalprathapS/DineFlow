package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.CategoryRequest;
import com.dineflow.dineflowbackend.dto.CategoryResponse;
import com.dineflow.dineflowbackend.entity.Category;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.mapper.CategoryMapper;
import com.dineflow.dineflowbackend.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return categoryMapper.toResponse(category);
    }

    public List<CategoryResponse> getActiveCategoriesByRestaurant(Long restaurantId) {
        return categoryRepository.findByRestaurantIdAndIsActiveTrueOrderByDisplayOrderAsc(restaurantId)
                .stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Page<CategoryResponse> getCategoriesByRestaurant(Long restaurantId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<Category> categoryPage = categoryRepository.findByRestaurantId(restaurantId, pageable);
        return categoryPage.map(categoryMapper::toResponse);
    }

    public Page<CategoryResponse> searchCategories(Long restaurantId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categoryPage = categoryRepository.findByRestaurantIdAndNameContainingIgnoreCase(
                restaurantId, keyword, pageable);
        return categoryPage.map(categoryMapper::toResponse);
    }

    public List<CategoryResponse> searchCategoriesByName(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword)
                .stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryMapper.updateEntityFromRequest(existing, request);
        return categoryMapper.toResponse(categoryRepository.save(existing));
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    public CategoryResponse toggleActive(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setIsActive(!category.getIsActive());
        return categoryMapper.toResponse(categoryRepository.save(category));
    }
}
