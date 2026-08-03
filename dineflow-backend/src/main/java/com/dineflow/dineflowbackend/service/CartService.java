package com.dineflow.dineflowbackend.service;

import com.dineflow.dineflowbackend.dto.AddToCartRequest;
import com.dineflow.dineflowbackend.dto.CartItemResponse;
import com.dineflow.dineflowbackend.dto.CartResponse;
import com.dineflow.dineflowbackend.dto.UpdateCartItemRequest;
import com.dineflow.dineflowbackend.entity.*;
import com.dineflow.dineflowbackend.exception.ResourceNotFoundException;
import com.dineflow.dineflowbackend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       MenuItemRepository menuItemRepository,
                       RestaurantRepository restaurantRepository,
                       RestaurantTableRepository tableRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CartResponse addToCart(Long customerId, AddToCartRequest request) {
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        if (!menuItem.getIsAvailable()) {
            throw new RuntimeException("Menu item is not available");
        }

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElse(null);

        if (cart == null) {
            cart = createNewCart(customerId, request.getRestaurantId(), request.getTableId());
        } else if (!cart.getRestaurant().getId().equals(request.getRestaurantId())) {
            clearCart(customerId);
            cart = createNewCart(customerId, request.getRestaurantId(), request.getTableId());
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndMenuItemId(
                cart.getId(), request.getMenuItemId());

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            if (request.getSpecialInstructions() != null) {
                cartItem.setSpecialInstructions(request.getSpecialInstructions());
            }
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .menuItem(menuItem)
                    .quantity(request.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .specialInstructions(request.getSpecialInstructions())
                    .build();
            cart.getItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);
        cart.recalculateTotals();
        Cart savedCart = cartRepository.save(cart);
        return toResponse(savedCart);
    }

    private Cart createNewCart(Long customerId, Long restaurantId, Long tableId) {
        Cart cart = new Cart();
        if (customerId != null) {
            User customer = userRepository.findById(customerId).orElse(null);
            cart.setCustomer(customer);
        }
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        cart.setRestaurant(restaurant);
        if (tableId != null) {
            RestaurantTable table = tableRepository.findById(tableId).orElse(null);
            cart.setTable(table);
        }
        return cartRepository.save(cart);
    }

    public CartResponse getCartByCustomer(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return toResponse(cart);
    }

    public CartResponse getCartById(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Long customerId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        if (request.getQuantity() != null) {
            cartItem.setQuantity(request.getQuantity());
        }
        if (request.getSpecialInstructions() != null) {
            cartItem.setSpecialInstructions(request.getSpecialInstructions());
        }

        cartItemRepository.save(cartItem);
        cart.recalculateTotals();
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeCartItem(Long customerId, Long cartItemId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        cart.recalculateTotals();
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartRepository.findByCustomerId(customerId).ifPresent(cart -> {
            cartItemRepository.deleteByCartId(cart.getId());
            cartRepository.delete(cart);
        });
    }

    public BigDecimal calculateTotal(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return cart.getTotalAmount();
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems()
                .stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        int totalItems = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .customerId(cart.getCustomer() != null ? cart.getCustomer().getId() : null)
                .customerName(cart.getCustomer() != null ? cart.getCustomer().getName() : null)
                .restaurantId(cart.getRestaurant().getId())
                .restaurantName(cart.getRestaurant().getName())
                .tableId(cart.getTable() != null ? cart.getTable().getId() : null)
                .tableNumber(cart.getTable() != null ? cart.getTable().getTableNumber() : null)
                .subtotal(cart.getSubtotal())
                .taxAmount(cart.getTaxAmount())
                .totalAmount(cart.getTotalAmount())
                .totalItems(totalItems)
                .items(itemResponses)
                .build();
    }

    private CartItemResponse toItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .menuItemImage(item.getMenuItem().getImageUrl())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .specialInstructions(item.getSpecialInstructions())
                .build();
    }
}
