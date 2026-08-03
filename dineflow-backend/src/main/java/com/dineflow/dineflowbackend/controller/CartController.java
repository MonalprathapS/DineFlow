package com.dineflow.dineflowbackend.controller;

import com.dineflow.dineflowbackend.dto.*;
import com.dineflow.dineflowbackend.service.CartService;
import com.dineflow.dineflowbackend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    public CartController(CartService cartService, JwtUtil jwtUtil) {
        this.cartService = cartService;
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

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        CartResponse cart = cartService.getCartByCustomer(userId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCartById(@PathVariable Long cartId) {
        CartResponse cart = cartService.getCartById(cartId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        CartResponse cart = cartService.updateCartItem(userId, cartItemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeCartItem(
            @PathVariable Long cartItemId,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        CartResponse cart = cartService.removeCartItem(userId, cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }

    @GetMapping("/total")
    public ResponseEntity<ApiResponse<BigDecimal>> calculateTotal(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        BigDecimal total = cartService.calculateTotal(userId);
        return ResponseEntity.ok(ApiResponse.success(total));
    }
}
