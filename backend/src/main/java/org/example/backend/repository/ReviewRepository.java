package org.example.backend.repository;

import org.example.backend.entity.Product;
import org.example.backend.entity.Review;
import org.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
    List<Review> findByUser(User user);
    Optional<Review> findByIdAndUser(Long id, User user);
    boolean existsByUserAndProduct(User user, Product product);
}
