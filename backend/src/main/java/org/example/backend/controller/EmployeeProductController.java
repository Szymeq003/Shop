package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.ProductDTO;
import org.example.backend.dto.product.ProductDetailDTO;
import org.example.backend.dto.product.ProductSaveRequest;
import org.example.backend.dto.product.ProductSearchCriteria;
import org.example.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee/products")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('PRACOWNIK', 'ADMIN')")
public class EmployeeProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(ProductSearchCriteria criteria, Pageable pageable) {
        return ResponseEntity.ok(productService.getAdminProducts(criteria, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDetailDTO> createProduct(@RequestBody ProductSaveRequest request) {
        return ResponseEntity.ok(productService.saveProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> updateProduct(@PathVariable Long id, @RequestBody ProductSaveRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
