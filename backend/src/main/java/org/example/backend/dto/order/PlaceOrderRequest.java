package org.example.backend.dto.order;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {
    private Long addressId;
    private String shippingMethod;
    private String paymentMethod;
}
