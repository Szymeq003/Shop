package org.example.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSaveRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private List<String> imageUrls;
    private List<VariantRequest> variants;
    private String status; // AKTYWNY, UKRYTY

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantRequest {
        private Long id; // null for new variant
        private String sku;
        private BigDecimal price;
        private Integer stockQuantity;
        private Map<String, String> attributes; // Name -> Value
    }
}
