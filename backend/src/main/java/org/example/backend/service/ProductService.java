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
import org.example.backend.repository.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;

    public Page<ProductDTO> getProducts(ProductSearchCriteria criteria, Pageable pageable) {
        return getProductsInternal(criteria, pageable, Product.Status.AKTYWNY);
    }

    public Page<ProductDTO> getAdminProducts(ProductSearchCriteria criteria, Pageable pageable) {
        return getProductsInternal(criteria, pageable, null);
    }

    private Page<ProductDTO> getProductsInternal(ProductSearchCriteria criteria, Pageable pageable, Product.Status status) {
        final List<Long> finalCategoryIds = new java.util.ArrayList<>();
        if (criteria != null && criteria.getCategoryId() != null) {
            finalCategoryIds.add(criteria.getCategoryId());
            categoryRepository.findById(criteria.getCategoryId())
                .ifPresent(cat -> getAllCategoryIdsRecursive(cat, finalCategoryIds));
        }

        Specification<Product> spec = ProductSpecification.filterByCriteria(criteria, finalCategoryIds.isEmpty() ? null : finalCategoryIds);
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

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
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt nie znaleziony"));
        return convertToDetailDTO(product);
    }

    @Transactional
    public ProductDetailDTO saveProduct(ProductSaveRequest request) {
        return saveOrUpdateProduct(null, request);
    }

    @Transactional
    public ProductDetailDTO updateProduct(Long id, ProductSaveRequest request) {
        return saveOrUpdateProduct(id, request);
    }

    private ProductDetailDTO saveOrUpdateProduct(Long id, ProductSaveRequest request) {
        Product product;
        if (id != null) {
            product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Produkt nie znaleziony"));
        } else {
            product = new Product();
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus() != null ? Product.Status.valueOf(request.getStatus()) : Product.Status.AKTYWNY);
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Kategoria nie znaleziona"));
        product.setCategory(category);

        product = productRepository.save(product);

        // Handle Images
        if (request.getImageUrls() != null) {
            product.getImages().clear();
            for (String url : request.getImageUrls()) {
                product.getImages().add(ProductImage.builder()
                        .product(product)
                        .imagePath(url)
                        .build());
            }
        }

        // Handle Variants
        if (request.getVariants() != null) {
            // Reconcile variants to avoid Duplicate SKU errors
            Map<String, ProductVariant> existingVariants = product.getVariants().stream()
                    .collect(Collectors.toMap(ProductVariant::getSku, v -> v, (v1, v2) -> v1));
            
            List<ProductVariant> newVariants = new ArrayList<>();
            
            for (ProductSaveRequest.VariantRequest vr : request.getVariants()) {
                ProductVariant variant = existingVariants.get(vr.getSku());
                
                if (variant == null) {
                    variant = new ProductVariant();
                    variant.setProduct(product);
                    variant.setSku(vr.getSku());
                }
                
                variant.setPrice(vr.getPrice());
                variant.setStockQuantity(vr.getStockQuantity());
                
                // Handle Attributes for variant
                variant.getAttributeValues().clear();
                if (vr.getAttributes() != null) {
                    for (Map.Entry<String, String> entry : vr.getAttributes().entrySet()) {
                        ProductAttribute attribute = productAttributeRepository.findByName(entry.getKey())
                                .orElseGet(() -> productAttributeRepository.save(ProductAttribute.builder().name(entry.getKey()).build()));
                        
                        variant.getAttributeValues().add(ProductAttributeValue.builder()
                                .attribute(attribute)
                                .value(entry.getValue())
                                .build());
                    }
                }
                newVariants.add(variant);
            }
            
            // Clear and re-add reconciled variants to the orphan-removal list
            product.getVariants().clear();
            product.getVariants().addAll(newVariants);
        }

        Product saved = productRepository.save(product);
        return convertToDetailDTO(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produkt nie znaleziony");
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public CategoryDTO saveCategory(CategorySaveRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rodzic kategorii nie znaleziony"));
            category.setParent(parent);
        }
        
        return convertToCategoryDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategorySaveRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategoria nie znaleziona"));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rodzic kategorii nie znaleziony"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
        
        return convertToCategoryDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Kategoria nie znaleziona");
        }
        categoryRepository.deleteById(id);
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
                .status(product.getStatus() != null ? product.getStatus().name() : null)
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
