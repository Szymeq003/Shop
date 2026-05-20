package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.admin.AdminStatsResponse;
import org.example.backend.dto.admin.AdminUserCreateRequest;
import org.example.backend.dto.order.OrderResponse;
import org.example.backend.dto.user.UserResponse;
import org.example.backend.entity.*;
import org.example.backend.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final ReviewRepository reviewRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, User.Role role, String callerEmail) {
        User caller = userRepository.findByEmail(callerEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zalogowanego użytkownika"));
        
        if (caller.getId().equals(userId)) {
            throw new RuntimeException("Nie możesz zmienić własnej roli!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        
        user.setRole(role);
        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId, String callerEmail) {
        User caller = userRepository.findByEmail(callerEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zalogowanego użytkownika"));
        
        if (caller.getId().equals(userId)) {
            throw new RuntimeException("Nie możesz usunąć samego siebie!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        // 1. Delete Password Reset Tokens
        passwordResetTokenRepository.deleteAllByUserId(userId);

        // 2. Delete Verification Tokens
        verificationTokenRepository.deleteAllByUserId(userId);

        // 3. Delete Cart and CartItems
        cartRepository.findByUser(user).ifPresent(cartRepository::delete);

        // 4. Delete Wishlist Items
        List<WishlistItem> wishlistItems = wishlistRepository.findByUser(user);
        if (!wishlistItems.isEmpty()) {
            wishlistRepository.deleteAll(wishlistItems);
        }

        // 5. Delete Reviews
        List<Review> reviews = reviewRepository.findByUser(user);
        if (!reviews.isEmpty()) {
            reviewRepository.deleteAll(reviews);
        }

        // 6. Delete Orders and OrderItems
        List<Order> orders = orderRepository.findByUserIdWithItems(userId);
        if (!orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        }

        // 7. Delete the User (this cascades to Addresses automatically via JPA cascade)
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse createUser(AdminUserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email jest już zajęty");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .emailVerifiedAt(LocalDateTime.now()) // Pre-verify email since it's created by admin
                .build();

        return toUserResponse(userRepository.save(user));
    }

    public AdminStatsResponse getStats() {
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        List<Order> allOrders = orderRepository.findAllWithItems();
        long totalOrders = allOrders.size();

        // Calculate total sales from all non-canceled, paid (or expected to be paid/in progress) orders.
        // We'll count orders where status != anulowane and paymentStatus == "Opłacone"
        BigDecimal totalSales = allOrders.stream()
                .filter(o -> !"anulowane".equals(o.getStatus().name()) && "Opłacone".equals(o.getPaymentStatus()))
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get recent 5 orders
        List<OrderResponse> recentOrders = allOrders.stream()
                .limit(5)
                .map(this::toOrderResponse)
                .toList();

        // Calculate sales trend for the last 7 days
        Map<String, BigDecimal> dailySalesMap = new TreeMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime now = LocalDateTime.now();

        // Initialize last 7 days with zero
        for (int i = 6; i >= 0; i--) {
            dailySalesMap.put(now.minusDays(i).format(formatter), BigDecimal.ZERO);
        }

        // Aggregate order sales by day
        allOrders.stream()
                .filter(o -> !"anulowane".equals(o.getStatus().name()) && "Opłacone".equals(o.getPaymentStatus()))
                .forEach(o -> {
                    String orderDate = o.getCreatedAt().format(formatter);
                    if (dailySalesMap.containsKey(orderDate)) {
                        dailySalesMap.put(orderDate, dailySalesMap.get(orderDate).add(o.getTotalPrice()));
                    }
                });

        List<AdminStatsResponse.DailySales> salesTrend = dailySalesMap.entrySet().stream()
                .map(entry -> new AdminStatsResponse.DailySales(entry.getKey(), entry.getValue()))
                .toList();

        return AdminStatsResponse.builder()
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .recentOrders(recentOrders)
                .salesTrend(salesTrend)
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getCreatedAt()
        );
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems() == null ? List.of() :
                order.getItems().stream().map(item -> new OrderResponse.OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getVariantId(),
                        item.getQuantity(),
                        item.getPrice()
                )).toList();

        OrderResponse.OrderAddressResponse addr = new OrderResponse.OrderAddressResponse(
                order.getAddress().getFirstName(),
                order.getAddress().getLastName(),
                order.getAddress().getStreet(),
                order.getAddress().getCity(),
                order.getAddress().getPostalCode(),
                order.getAddress().getCountry(),
                order.getAddress().getPhone()
        );

        return new OrderResponse(
                order.getId(),
                order.getTotalPrice(),
                order.getStatus().name(),
                order.getPaymentStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items,
                addr,
                order.getShippingMethod(),
                order.getPaymentMethod(),
                order.getShippingFee(),
                order.getUser().getName(),
                order.getUser().getEmail()
        );
    }
}
