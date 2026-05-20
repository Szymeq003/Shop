package org.example.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.dto.order.OrderResponse;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private BigDecimal totalSales;
    private long totalOrders;
    private long totalProducts;
    private long totalUsers;
    private List<OrderResponse> recentOrders;
    private List<DailySales> salesTrend;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailySales {
        private String date;
        private BigDecimal sales;
    }
}
