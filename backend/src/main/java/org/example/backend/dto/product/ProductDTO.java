package org.example.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String categoryName;
    private Long categoryId;
    private String mainImageUrl;
    private Long defaultVariantId;
    private Double averageRating;
    private Integer reviewCount;
    private String status;
    private Integer totalStock;
}
