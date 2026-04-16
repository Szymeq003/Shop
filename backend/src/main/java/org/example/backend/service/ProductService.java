package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.*;
import org.example.backend.entity.*;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.ProductRepository;
import org.example.backend.repository.specification.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDTO> getProducts(ProductSearchCriteria criteria, Pageable pageable) {
        final List<Long> finalCategoryIds = new java.util.ArrayList<>();
        if (criteria.getCategoryId() != null) {
            finalCategoryIds.add(criteria.getCategoryId());
            categoryRepository.findById(criteria.getCategoryId())
                .ifPresent(cat -> getAllCategoryIdsRecursive(cat, finalCategoryIds));
        }

        Specification<Product> spec = ProductSpecification.filterByCriteria(criteria, finalCategoryIds.isEmpty() ? null : finalCategoryIds);
        return productRepository.findAll(spec, pageable).map(this::convertToDTO);
    }

    private void getAllCategoryIdsRecursive(Category category, List<Long> ids) {
        for (Category child : category.getChildren()) {
            ids.add(child.getId());
            getAllCategoryIdsRecursive(child, ids);
        }
    }

    @Transactional
    public void syncAllProductRatings() {
        productRepository.findAll().forEach(product -> {
            int count = product.getReviews().size();
            double average = count > 0 ? 
                product.getReviews().stream().mapToInt(Review::getRating).average().orElse(0.0) : 0.0;
            product.setAverageRating(average);
            product.setReviewCount(count);
            productRepository.save(product);
        });
    }

    public ProductDetailDTO getProductById(Long id) {
        Product product = productRepository.findByIdAndStatus(id, Product.Status.AKTYWNY)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt nie znaleziony lub jest niedostępny"));
        return convertToDetailDTO(product);
    }

    public List<CategoryDTO> getCategories() {
        return categoryRepository.findByParentIsNull().stream()
                .map(this::convertToCategoryDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .mainImageUrl(!product.getImages().isEmpty() ? product.getImages().get(0).getImagePath() : null)
                .defaultVariantId(!product.getVariants().isEmpty() ? product.getVariants().get(0).getId() : null)
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .build();
    }

    private ProductDetailDTO convertToDetailDTO(Product product) {
        // Build attributes map from all variants
        Map<String, List<String>> attributesMap = new HashMap<>();
        product.getVariants().forEach(variant ->
            variant.getAttributeValues().forEach(av -> {
                String key = av.getAttribute().getName();
                attributesMap.computeIfAbsent(key, k -> new java.util.ArrayList<>());
                String val = av.getValue();
                if (!attributesMap.get(key).contains(val)) {
                    attributesMap.get(key).add(val);
                }
            })
        );

        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImagePath).collect(Collectors.toList());
        
        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .mainImageUrl(imageUrls.isEmpty() ? null : imageUrls.get(0))
                .imageUrls(imageUrls)
                .variants(product.getVariants().stream().map(this::convertToVariantDTO).collect(Collectors.toList()))
                .reviews(product.getReviews().stream().map(this::convertToReviewDTO).collect(Collectors.toList()))
                .attributes(attributesMap)
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .build();
    }

    private ProductVariantDTO convertToVariantDTO(ProductVariant variant) {
        return ProductVariantDTO.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .stockQuantity(variant.getStockQuantity())
                .attributeValues(variant.getAttributeValues().stream()
                    .collect(Collectors.toMap(
                        av -> av.getAttribute().getName(),
                        ProductAttributeValue::getValue,
                        (v1, v2) -> v1
                    )))
                .build();
    }

    private ReviewDTO convertToReviewDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private CategoryDTO convertToCategoryDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .children(category.getChildren().stream()
                        .map(this::convertToCategoryDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}
