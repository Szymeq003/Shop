package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.cart.AddToCartRequest;
import org.example.backend.dto.cart.CartDTO;
import org.example.backend.dto.cart.CartItemDTO;
import org.example.backend.entity.*;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.repository.CartItemRepository;
import org.example.backend.repository.CartRepository;
import org.example.backend.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional(readOnly = true)
    public CartDTO getCartDTO(User user) {
        Cart cart = getOrCreateCart(user);
        return convertToDTO(cart);
    }

    @Transactional
    public CartDTO addItemToCart(User user, AddToCartRequest request) {
        Cart cart = getOrCreateCart(user);
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndVariant(cart, variant);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return convertToDTO(cart);
    }

    @Transactional
    public CartDTO updateItemQuantity(User user, Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            item.getCart().getItems().remove(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return convertToDTO(item.getCart());
    }

    @Transactional
    public CartDTO removeItemFromCart(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return convertToDTO(cart);
    }

    @Transactional
    public CartDTO mergeCarts(User user, List<AddToCartRequest> guestItems) {
        Cart cart = getOrCreateCart(user);

        for (AddToCartRequest request : guestItems) {
            addItemToCart(user, request);
        }

        return convertToDTO(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartDTO convertToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::convertToItemDTO)
                .collect(Collectors.toList());

        BigDecimal total = itemDTOs.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalCount = itemDTOs.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        return CartDTO.builder()
                .items(itemDTOs)
                .totalPrice(total)
                .totalItems(totalCount)
                .build();
    }

    private CartItemDTO convertToItemDTO(CartItem item) {
        ProductVariant variant = item.getVariant();
        Product product = variant.getProduct();

        BigDecimal price = variant.getPrice() != null ? variant.getPrice() : product.getPrice();
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

        Map<String, String> attributes = variant.getAttributeValues().stream()
                .collect(Collectors.toMap(
                        av -> av.getAttribute().getName(),
                        ProductAttributeValue::getValue,
                        (existing, replacement) -> existing
                ));

        String imageUrl = product.getImages().isEmpty() ? null : product.getImages().get(0).getImagePath();

        return CartItemDTO.builder()
                .id(item.getId())
                .productId(product.getId())
                .variantId(variant.getId())
                .productName(product.getName())
                .sku(variant.getSku())
                .mainImageUrl(imageUrl)
                .price(price)
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .attributes(attributes)
                .build();
    }
}
