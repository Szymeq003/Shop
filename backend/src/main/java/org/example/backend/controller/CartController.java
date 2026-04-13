package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.cart.AddToCartRequest;
import org.example.backend.dto.cart.CartDTO;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.getCartDTO(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addItem(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody AddToCartRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.addItemToCart(user, request));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartDTO> updateQuantity(@AuthenticationPrincipal UserDetails userDetails,
                                                @PathVariable Long itemId,
                                                @RequestBody Integer quantity) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.updateItemQuantity(user, itemId, quantity));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<CartDTO> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable Long itemId) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.removeItemFromCart(user, itemId));
    }

    @PostMapping("/merge")
    public ResponseEntity<CartDTO> mergeCarts(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody List<AddToCartRequest> guestItems) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(cartService.mergeCarts(user, guestItems));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
