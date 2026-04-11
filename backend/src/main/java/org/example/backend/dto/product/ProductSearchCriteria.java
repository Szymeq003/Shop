package org.example.backend.dto.product;

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
public class ProductSearchCriteria {
    private String search;
    private Long categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Map<String, String> attributes;
}
