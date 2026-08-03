package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.CategoryRequest;
import com.dineflow.dineflowbackend.dto.CategoryResponse;
import com.dineflow.dineflowbackend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created", category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getCategories(
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "displayOrder") String sortBy) {

        if (restaurantId == null && search != null) {
            List<CategoryResponse> categories = categoryService.searchCategoriesByName(search);
            return ResponseEntity.ok(ApiResponse.success(categories));
        }

        if (restaurantId != null) {
            if (paginated) {
                if (search != null && !search.isEmpty()) {
                    Page<CategoryResponse> categoryPage = categoryService.searchCategories(
                            restaurantId, search, page, size);
                    return ResponseEntity.ok(ApiResponse.success(categoryPage));
                }
                Page<CategoryResponse> categoryPage = categoryService.getCategoriesByRestaurant(
                        restaurantId, page, size, sortBy);
                return ResponseEntity.ok(ApiResponse.success(categoryPage));
            }
            List<CategoryResponse> categories = categoryService.getActiveCategoriesByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success(categories));
        }

        return ResponseEntity.badRequest()
                .body(ApiResponse.error("restaurantId is required"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated", category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<CategoryResponse>> toggleActive(@PathVariable Long id) {
        CategoryResponse category = categoryService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success("Category status updated", category));
    }
}
