package org.example.backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long id;
    private Long productId;
    private Long variantId;
    private String productName;
    private String sku;
    private String mainImageUrl;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private Map<String, String> attributes;
    private Integer stockQuantity;
}
