package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.order.OrderResponse;
import org.example.backend.entity.Order;
import org.example.backend.entity.User;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

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
                addr
        );
    }
}
