package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.ApiResponse;
import com.dineflow.dineflowbackend.dto.FeedbackRequest;
import com.dineflow.dineflowbackend.dto.FeedbackResponse;
import com.dineflow.dineflowbackend.service.FeedbackService;
import com.dineflow.dineflowbackend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final JwtUtil jwtUtil;

    public FeedbackController(FeedbackService feedbackService, JwtUtil jwtUtil) {
        this.feedbackService = feedbackService;
        this.jwtUtil = jwtUtil;
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackResponse>> createFeedback(
            @Valid @RequestBody FeedbackRequest request,
            HttpServletRequest httpRequest) {
        if (request.getCustomerId() == null) {
            request.setCustomerId(extractUserId(httpRequest));
        }
        FeedbackResponse feedback = feedbackService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted", feedback));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedbackById(@PathVariable Long id) {
        FeedbackResponse feedback = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getFeedback(
            @RequestParam(required = false) Long restaurantId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long orderId,
            @RequestParam(defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {

        if (customerId == null) {
            String role = extractRole(httpRequest);
            if ("CUSTOMER".equals(role)) {
                customerId = extractUserId(httpRequest);
            }
        }

        if (orderId != null) {
            List<FeedbackResponse> feedback = feedbackService.getFeedbackByOrder(orderId);
            return ResponseEntity.ok(ApiResponse.success(feedback));
        }

        if (customerId != null) {
            List<FeedbackResponse> feedback = feedbackService.getFeedbackByCustomer(customerId);
            return ResponseEntity.ok(ApiResponse.success(feedback));
        }

        if (restaurantId != null) {
            if (paginated) {
                Page<FeedbackResponse> feedbackPage = feedbackService.getFeedbackByRestaurantPaged(
                        restaurantId, page, size);
                return ResponseEntity.ok(ApiResponse.success(feedbackPage));
            }
            List<FeedbackResponse> feedback = feedbackService.getFeedbackByRestaurant(restaurantId);
            return ResponseEntity.ok(ApiResponse.success(feedback));
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("restaurantId, customerId, or orderId is required"));
    }

    private String extractRole(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractRole(token);
        }
        return null;
    }

    @GetMapping("/restaurant/{restaurantId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRatingSummary(@PathVariable Long restaurantId) {
        Map<String, Object> summary = new HashMap<>();
        BigDecimal avgRating = feedbackService.getAverageRating(restaurantId);
        Long totalReviews = feedbackService.getTotalReviews(restaurantId);
        summary.put("averageRating", avgRating);
        summary.put("totalReviews", totalReviews);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted", null));
    }
}
