package org.example.backend.controller;
 
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.order.OrderResponse;
import org.example.backend.entity.Order;
import org.example.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/employee/orders")
@RequiredArgsConstructor
public class EmployeeOrderController {
 
    private final OrderService orderService;
 
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForEmployee());
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderByIdForEmployee(id));
    }
 
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Order.Status status = Order.Status.valueOf(request.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
