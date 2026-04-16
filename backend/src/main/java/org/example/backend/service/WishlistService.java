package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.ProductDTO;
import org.example.backend.entity.Product;
import org.example.backend.entity.User;
import org.example.backend.entity.WishlistItem;
import org.example.backend.entity.ProductImage;
import org.example.backend.entity.Review;
import org.example.backend.entity.ProductVariant;
import org.example.backend.repository.ProductRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.WishlistRepository;
import org.example.backend.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addToWishlist(Long productId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie znaleziony"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt nie znaleziony"));

        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            WishlistItem item = WishlistItem.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(item);
        }
    }

    @Transactional
    public void removeFromWishlist(Long productId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie znaleziony"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt nie znaleziony"));

        wishlistRepository.findByUserAndProduct(user, product)
                .ifPresent(wishlistRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie znaleziony"));
        
        return wishlistRepository.findByUser(user).stream()
                .map(item -> convertToDTO(item.getProduct()))
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .mainImageUrl(!product.getImages().isEmpty() ? product.getImages().get(0).getImagePath() : null)
                .defaultVariantId(!product.getVariants().isEmpty() ? product.getVariants().get(0).getId() : null)
                .averageRating(product.getReviews().isEmpty() ? 0.0 : 
                    product.getReviews().stream().mapToInt(Review::getRating).average().orElse(0.0))
                .reviewCount(product.getReviews().size())
                .build();
    }
}
