package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.order.OrderResponse;
import org.example.backend.dto.order.PlaceOrderRequest;
import org.example.backend.entity.*;
import org.example.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final ProductVariantRepository productVariantRepository;

    public List<OrderResponse> getOrders(String email) {
        User user = findUser(email);
        return orderRepository.findByUserIdWithItems(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public OrderResponse getOrderById(String email, Long id) {
        User user = findUser(email);
        Order order = orderRepository.findByIdAndUserIdWithItems(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Zamówienie nie znalezione"));
        return toResponse(order);
    }

    @Transactional
    public OrderResponse placeOrder(String email, PlaceOrderRequest request) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Koszyk nie znaleziony"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Koszyk jest pusty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Adres nie znaleziony"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Nieprawidłowy adres");
        }

        BigDecimal shippingFee = request.getShippingMethod().contains("Kurier") 
                ? new BigDecimal("15.00") : new BigDecimal("12.00");

        BigDecimal itemsTotal = cart.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getVariant().getPrice() != null 
                            ? item.getVariant().getPrice() : item.getVariant().getProduct().getPrice();
                    return price.multiply(new BigDecimal(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalPrice(itemsTotal.add(shippingFee))
                .status(Order.Status.nowe)
                .paymentStatus("Oczekuje")
                .shippingMethod(request.getShippingMethod())
                .paymentMethod(request.getPaymentMethod())
                .shippingFee(shippingFee)
                .items(new ArrayList<>())
                .build();

        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getVariant();
            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Brak wystarczającej ilości produktu: " + variant.getProduct().getName());
            }

            // Update stock
            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            productVariantRepository.save(variant);

            BigDecimal itemPrice = variant.getPrice() != null 
                    ? variant.getPrice() : variant.getProduct().getPrice();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(variant.getProduct())
                    .variantId(variant.getId())
                    .quantity(cartItem.getQuantity())
                    .price(itemPrice)
                    .build();
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return toResponse(savedOrder);
    }

    @Transactional
    public void cancelOrder(String email, Long orderId) {
        User user = findUser(email);
        Order order = orderRepository.findByIdAndUserIdWithItems(orderId, user.getId())
                .orElseThrow(() -> new RuntimeException("Zamówienie nie znalezione"));

        if (order.getStatus() != Order.Status.nowe) {
            throw new RuntimeException("Nie można anulować zamówienia w obecnym statusie");
        }

        order.setStatus(Order.Status.anulowane);
        
        // Restore stock
        for (OrderItem item : order.getItems()) {
            productVariantRepository.findById(item.getVariantId()).ifPresent(variant -> {
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                productVariantRepository.save(variant);
            });
        }

        orderRepository.save(order);
    }

    @Transactional
    public OrderResponse confirmPayment(String email, Long orderId) {
        User user = findUser(email);
        Order order = orderRepository.findByIdAndUserIdWithItems(orderId, user.getId())
                .orElseThrow(() -> new RuntimeException("Zamówienie nie znalezione"));

        if (order.getStatus() == Order.Status.anulowane) {
            throw new RuntimeException("Nie można opłacić anulowanego zamówienia");
        }
        if ("Opłacone".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Zamówienie jest już opłacone");
        }

        order.setPaymentStatus("Opłacone");
        order.setStatus(Order.Status.oplacone);
        return toResponse(orderRepository.save(order));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems() == null ? List.of() :
                order.getItems().stream().map(item -> new OrderResponse.OrderItemResponse(
                        item.getProduct().getId(),
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
                order.getShippingFee()
        );
    }
}
