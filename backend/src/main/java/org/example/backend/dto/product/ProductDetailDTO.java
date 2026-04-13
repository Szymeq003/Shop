package org.example.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryName;
    private Long categoryId;
    private String mainImageUrl;
    private List<String> imageUrls;
    private List<ProductVariantDTO> variants;
    private List<ReviewDTO> reviews;
    private Map<String, List<String>> attributes;
    private Double averageRating;
    private Integer reviewCount;
}
