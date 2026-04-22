package org.example.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private BigDecimal totalPrice;
    private String status;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;
    private OrderAddressResponse address;
    private String shippingMethod;
    private String paymentMethod;
    private BigDecimal shippingFee;
    private String customerName;
    private String customerEmail;

    @Data
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private Long variantId;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @AllArgsConstructor
    public static class OrderAddressResponse {
        private String firstName;
        private String lastName;
        private String street;
        private String city;
        private String postalCode;
        private String country;
        private String phone;
    }
}
