package org.example.backend.repository;

import org.example.backend.entity.Product;
import org.example.backend.entity.User;
import org.example.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(@org.springframework.data.repository.query.Param("user") User user);
    
    Optional<WishlistItem> findByUserAndProduct(
            @org.springframework.data.repository.query.Param("user") User user, 
            @org.springframework.data.repository.query.Param("product") Product product);
    
    boolean existsByUserAndProduct(
            @org.springframework.data.repository.query.Param("user") User user, 
            @org.springframework.data.repository.query.Param("product") Product product);
    
    void deleteByUserAndProduct(
            @org.springframework.data.repository.query.Param("user") User user, 
            @org.springframework.data.repository.query.Param("product") Product product);
}
