package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.FeedbackRequest;
import com.dineflow.dineflowbackend.dto.FeedbackResponse;
import com.dineflow.dineflowbackend.entity.Feedback;
import com.dineflow.dineflowbackend.entity.Order;
import com.dineflow.dineflowbackend.entity.Restaurant;
import com.dineflow.dineflowbackend.entity.User;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.repository.FeedbackRepository;
import com.dineflow.dineflowbackend.repository.OrderRepository;
import com.dineflow.dineflowbackend.repository.RestaurantRepository;
import com.dineflow.dineflowbackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           UserRepository userRepository,
                           RestaurantRepository restaurantRepository,
                           OrderRepository orderRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Feedback feedback = Feedback.builder()
                .customer(customer)
                .restaurant(restaurant)
                .rating(request.getRating())
                .review(request.getReview())
                .foodQualityRating(request.getFoodQualityRating())
                .serviceRating(request.getServiceRating())
                .ambienceRating(request.getAmbienceRating())
                .valueRating(request.getValueRating())
                .wouldRecommend(request.getWouldRecommend() != null ? request.getWouldRecommend() : true)
                .build();

        if (request.getOrderId() != null) {
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            feedback.setOrder(order);
        }

        Feedback saved = feedbackRepository.save(feedback);
        updateRestaurantRating(restaurant.getId());
        return toResponse(saved);
    }

    private void updateRestaurantRating(Long restaurantId) {
        BigDecimal avgRating = feedbackRepository.calculateAverageRating(restaurantId);
        Long totalReviews = feedbackRepository.countByRestaurantId(restaurantId);
        restaurantRepository.findById(restaurantId).ifPresent(restaurant -> {
            restaurant.setAvgRating(avgRating);
            restaurant.setTotalReviews(totalReviews.intValue());
            restaurantRepository.save(restaurant);
        });
    }

    public FeedbackResponse getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        return toResponse(feedback);
    }

    public List<FeedbackResponse> getFeedbackByRestaurant(Long restaurantId) {
        return feedbackRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Page<FeedbackResponse> getFeedbackByRestaurantPaged(Long restaurantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return feedbackRepository.findByRestaurantId(restaurantId, pageable)
                .map(this::toResponse);
    }

    public List<FeedbackResponse> getFeedbackByCustomer(Long customerId) {
        return feedbackRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getFeedbackByOrder(Long orderId) {
        return feedbackRepository.findByOrderId(orderId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BigDecimal getAverageRating(Long restaurantId) {
        return feedbackRepository.calculateAverageRating(restaurantId);
    }

    public Long getTotalReviews(Long restaurantId) {
        return feedbackRepository.countByRestaurantId(restaurantId);
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback not found");
        }
        feedbackRepository.deleteById(id);
    }

    private FeedbackResponse toResponse(Feedback f) {
        return FeedbackResponse.builder()
                .id(f.getId())
                .customerId(f.getCustomer() != null ? f.getCustomer().getId() : null)
                .customerName(f.getCustomer() != null ? f.getCustomer().getName() : null)
                .restaurantId(f.getRestaurant() != null ? f.getRestaurant().getId() : null)
                .restaurantName(f.getRestaurant() != null ? f.getRestaurant().getName() : null)
                .orderId(f.getOrder() != null ? f.getOrder().getId() : null)
                .orderNumber(f.getOrder() != null ? f.getOrder().getOrderNumber() : null)
                .rating(f.getRating())
                .review(f.getReview())
                .foodQualityRating(f.getFoodQualityRating())
                .serviceRating(f.getServiceRating())
                .ambienceRating(f.getAmbienceRating())
                .valueRating(f.getValueRating())
                .wouldRecommend(f.getWouldRecommend())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
