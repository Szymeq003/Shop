package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.ReviewDTO;
import org.example.backend.entity.Product;
import org.example.backend.entity.Review;
import org.example.backend.entity.User;
import org.example.backend.repository.ProductRepository;
import org.example.backend.repository.ReviewRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewDTO addReview(Long productId, String email, ReviewDTO reviewDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produkt nie znaleziony"));

        if (reviewRepository.existsByUserAndProduct(user, product)) {
            throw new RuntimeException("Już wystawiłeś opinię dla tego produktu");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .build();

        return convertToDTO(reviewRepository.save(review));
    }

    @Transactional
    public ReviewDTO updateReview(Long reviewId, String email, ReviewDTO reviewDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        Review review = reviewRepository.findByIdAndUser(reviewId, user)
                .orElseThrow(() -> new RuntimeException("Opinia nie znaleziona lub nie należy do Ciebie"));

        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        return convertToDTO(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        Review review = reviewRepository.findByIdAndUser(reviewId, user)
                .orElseThrow(() -> new RuntimeException("Opinia nie znaleziona lub nie należy do Ciebie"));

        reviewRepository.delete(review);
    }

    public List<ReviewDTO> getUserReviews(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        return reviewRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
