package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.ProductDTO;
import org.example.backend.dto.product.ProductDetailDTO;
import org.example.backend.dto.product.ProductSearchCriteria;
import org.example.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(@RequestParam Map<String, String> params) {
        String search = params.get("search");
        Long categoryId = params.containsKey("categoryId") ? Long.parseLong(params.get("categoryId")) : null;
        BigDecimal minPrice = params.containsKey("minPrice") ? new BigDecimal(params.get("minPrice")) : null;
        BigDecimal maxPrice = params.containsKey("maxPrice") ? new BigDecimal(params.get("maxPrice")) : null;
        int page = Integer.parseInt(params.getOrDefault("page", "0"));
        int size = Integer.parseInt(params.getOrDefault("size", "12"));
        String sort = params.getOrDefault("sort", "id,desc");

        // Clean map for attributes
        Map<String, String> attributes = new HashMap<>(params);
        Arrays.asList("search", "categoryId", "minPrice", "maxPrice", "page", "size", "sort").forEach(attributes::remove);

        ProductSearchCriteria criteria = ProductSearchCriteria.builder()
                .search(search)
                .categoryId(categoryId)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .attributes(attributes)
                .build();

        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

        return ResponseEntity.ok(productService.getProducts(criteria, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}
