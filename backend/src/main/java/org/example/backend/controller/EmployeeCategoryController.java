package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.product.CategoryDTO;
import org.example.backend.dto.product.CategorySaveRequest;
import org.example.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee/categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('PRACOWNIK', 'ADMIN')")
public class EmployeeCategoryController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategorySaveRequest request) {
        return ResponseEntity.ok(productService.saveCategory(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody CategorySaveRequest request) {
        return ResponseEntity.ok(productService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        productService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
