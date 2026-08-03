package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.*;
import com.dineflow.dineflowbackend.entity.*;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        MenuItemRepository menuItemRepository,
                        RestaurantRepository restaurantRepository,
                        RestaurantTableRepository tableRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public OrderResponse createOrder(Long customerId, CreateOrderRequest request) {
        Order order = new Order();

        if (customerId != null) {
            User customer = userRepository.findById(customerId).orElse(null);
            order.setCustomer(customer);
        }

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        order.setRestaurant(restaurant);

        if (request.getTableId() != null) {
            RestaurantTable table = tableRepository.findById(request.getTableId()).orElse(null);
            order.setTable(table);
            if (table != null) {
                table.setStatus(TableStatus.OCCUPIED);
                if (table.getAssignedWaiter() != null) {
                    order.setAssignedWaiter(table.getAssignedWaiter());
                }
            }
        }

        order.setOrderType(request.getOrderType());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setTransactionId(request.getTransactionId());
        order.setSpecialInstructions(request.getSpecialInstructions());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        if (request.getCartId() != null) {
            Cart cart = cartRepository.findById(request.getCartId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            for (CartItem cartItem : cart.getItems()) {
                OrderItem orderItem = buildOrderItem(cartItem.getMenuItem(), cartItem.getQuantity(),
                        cartItem.getSpecialInstructions());
                orderItem.setOrder(order);
                orderItems.add(orderItem);
                subtotal = subtotal.add(orderItem.getSubtotal());
            }
        } else if (request.getItems() != null) {
            for (OrderItemRequest itemRequest : request.getItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
                OrderItem orderItem = buildOrderItem(menuItem, itemRequest.getQuantity(),
                        itemRequest.getSpecialInstructions());
                orderItem.setOrder(order);
                orderItems.add(orderItem);
                subtotal = subtotal.add(orderItem.getSubtotal());
            }
        }

        order.setOrderItems(orderItems);
        order.setSubtotal(subtotal);
        order.setTaxAmount(subtotal.multiply(BigDecimal.valueOf(0.05)));
        order.setTotalAmount(subtotal.add(order.getTaxAmount()));
        if (request.getOrderType() == OrderType.DELIVERY && restaurant.getDeliveryFee() != null) {
            order.setDeliveryFee(restaurant.getDeliveryFee());
            order.setTotalAmount(order.getTotalAmount().add(order.getDeliveryFee()));
        }

        Order savedOrder = orderRepository.save(order);

        notificationService.createNotification(
                savedOrder.getRestaurant().getId(),
                NotificationType.NEW_ORDER,
                "New order " + savedOrder.getOrderNumber() + " received!",
                "/orders/" + savedOrder.getId()
        );

        return toResponse(savedOrder);
    }

    private OrderItem buildOrderItem(MenuItem menuItem, Integer quantity, String instructions) {
        return OrderItem.builder()
                .menuItem(menuItem)
                .menuItemName(menuItem.getName())
                .menuItemImage(menuItem.getImageUrl())
                .quantity(quantity)
                .unitPrice(menuItem.getPrice())
                .subtotal(menuItem.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .specialInstructions(instructions)
                .status(OrderItemStatus.PENDING)
                .build();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return toResponse(order);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return toResponse(order);
    }

    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByRestaurant(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByRestaurantAndStatus(Long restaurantId, OrderStatus status) {
        return orderRepository.findByRestaurantIdAndStatusOrderByCreatedAtDesc(restaurantId, status)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByWaiter(Long waiterId) {
        return orderRepository.findByAssignedWaiterIdOrderByCreatedAtDesc(waiterId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableIdOrderByCreatedAtDesc(tableId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getTodayOrders(Long restaurantId) {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
        return orderRepository.findByRestaurantIdAndDateRange(restaurantId, start, end)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus newStatus, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(newStatus);
        LocalDateTime now = LocalDateTime.now();

        switch (newStatus) {
            case ACCEPTED -> order.setAcceptedAt(now);
            case PREPARING -> order.setPreparingAt(now);
            case READY -> {
                order.setReadyAt(now);
                notificationService.createNotification(
                        order.getRestaurant().getId(),
                        NotificationType.FOOD_READY,
                        "Order " + order.getOrderNumber() + " is ready!",
                        "/orders/" + order.getId()
                );
            }
            case SERVED -> order.setServedAt(now);
            case COMPLETED -> order.setCompletedAt(now);
            case CANCELLED -> {
                order.setCancelledAt(now);
                if (request != null) {
                    order.setCancellationReason(request.getCancellationReason());
                }
                if (order.getTable() != null) {
                    order.getTable().setStatus(TableStatus.AVAILABLE);
                }
            }
        }

        if (request != null && request.getAssignedWaiterId() != null) {
            User waiter = userRepository.findById(request.getAssignedWaiterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Waiter not found"));
            order.setAssignedWaiter(waiter);
        }

        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse assignWaiter(Long orderId, Long waiterId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User waiter = userRepository.findById(waiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Waiter not found"));
        order.setAssignedWaiter(waiter);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updatePayment(Long orderId, PaymentStatus paymentStatus, String transactionId, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setPaymentStatus(paymentStatus);
        order.setTransactionId(transactionId);
        order.setPaymentMethod(paymentMethod);
        if (paymentStatus == PaymentStatus.PAID) {
            notificationService.createNotification(
                    order.getRestaurant().getId(),
                    NotificationType.PAYMENT_RECEIVED,
                    "Payment received for order " + order.getOrderNumber(),
                    "/orders/" + order.getId()
            );
        }
        return toResponse(orderRepository.save(order));
    }

    public BigDecimal generateBill(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return order.getTotalAmount();
    }

    public Page<OrderResponse> getOrdersByRestaurantPaged(Long restaurantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByRestaurantId(restaurantId, pageable)
                .map(this::toResponse);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems()
                .stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomer() != null ? order.getCustomer().getName() : null)
                .customerPhone(order.getCustomer() != null ? order.getCustomer().getPhone() : null)
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .assignedWaiterId(order.getAssignedWaiter() != null ? order.getAssignedWaiter().getId() : null)
                .assignedWaiterName(order.getAssignedWaiter() != null ? order.getAssignedWaiter().getName() : null)
                .status(order.getStatus())
                .orderType(order.getOrderType())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .taxAmount(order.getTaxAmount())
                .deliveryFee(order.getDeliveryFee())
                .totalAmount(order.getTotalAmount())
                .specialInstructions(order.getSpecialInstructions())
                .acceptedAt(order.getAcceptedAt())
                .preparingAt(order.getPreparingAt())
                .readyAt(order.getReadyAt())
                .servedAt(order.getServedAt())
                .completedAt(order.getCompletedAt())
                .cancelledAt(order.getCancelledAt())
                .cancellationReason(order.getCancellationReason())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem() != null ? item.getMenuItem().getId() : null)
                .menuItemName(item.getMenuItemName())
                .menuItemImage(item.getMenuItemImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .specialInstructions(item.getSpecialInstructions())
                .status(item.getStatus())
                .build();
    }
}
