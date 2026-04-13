package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.ReviewDTO;
import org.example.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{productId}")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long productId,
            @RequestBody ReviewDTO reviewDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie zalogowany");
        }
        return ResponseEntity.ok(reviewService.addReview(productId, userDetails.getUsername(), reviewDTO));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewDTO reviewDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie zalogowany");
        }
        return ResponseEntity.ok(reviewService.updateReview(reviewId, userDetails.getUsername(), reviewDTO));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie zalogowany");
        }
        reviewService.deleteReview(reviewId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Opinia została usunięta"));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ReviewDTO>> getMyReviews(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Użytkownik nie zalogowany");
        }
        return ResponseEntity.ok(reviewService.getUserReviews(userDetails.getUsername()));
    }
}
