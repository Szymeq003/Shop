package org.example.backend.repository.specification;

import jakarta.persistence.criteria.*;
import org.example.backend.dto.product.ProductSearchCriteria;
import org.example.backend.entity.Product;
import org.example.backend.entity.ProductAttributeValue;
import org.example.backend.entity.ProductVariant;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class ProductSpecification {

    public static Specification<Product> filterByCriteria(ProductSearchCriteria criteria, Collection<Long> categoryIds) {
        return (Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            query.distinct(true); // Prevent duplicate products due to joins
            List<Predicate> predicates = new ArrayList<>();

            // Status must be ACTIVE
            predicates.add(cb.equal(root.get("status"), Product.Status.AKTYWNY));

            // Search by name or description
            if (criteria.getSearch() != null && !criteria.getSearch().isEmpty()) {
                String searchTerm = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), searchTerm),
                    cb.like(cb.lower(root.get("description")), searchTerm)
                ));
            }

            // Filter by category (including subcategories)
            if (categoryIds != null && !categoryIds.isEmpty()) {
                predicates.add(root.get("category").get("id").in(categoryIds));
            }

            // Filter by price
            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));
            }

            // Filter by attributes
            if (criteria.getAttributes() != null && !criteria.getAttributes().isEmpty()) {
                for (Map.Entry<String, String> entry : criteria.getAttributes().entrySet()) {
                    // Skip internal parameters that are not product attributes
                    if (java.util.Arrays.asList("brands", "rating", "inStock", "fastShipping").contains(entry.getKey())) {
                        continue;
                    }
                    
                    Join<Product, ProductVariant> variantJoin = root.join("variants");
                    Join<ProductVariant, ProductAttributeValue> attrValueJoin = variantJoin.join("attributeValues");
                    
                    predicates.add(cb.and(
                        cb.equal(attrValueJoin.get("attribute").get("name"), entry.getKey()),
                        cb.equal(attrValueJoin.get("value"), entry.getValue())
                    ));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
