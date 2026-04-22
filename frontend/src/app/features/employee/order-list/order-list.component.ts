import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService, OrderResponse } from '../../../core/services/employee.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <header class="page-header">
        <h1 class="page-title">Zamówienia</h1>
        <p class="page-subtitle">Przeglądaj i zarządzaj zamówieniami klientów w czasie rzeczywistym.</p>
      </header>

      <div class="card filters-card">
        <div class="filters-flex">
          <div class="filter-item">
            <label for="status-filter">Filtruj wg statusu</label>
            <select id="status-filter" name="statusFilter" (change)="statusFilter.set($any($event.target).value)" class="form-select">
              <option value="">Wszystkie zamówienia</option>
              <option value="nowe">Nowe</option>
              <option value="oplacone">Opłacone</option>
              <option value="pakowane">W przygotowaniu</option>
              <option value="wyslane">Wysłane</option>
              <option value="dostarczone">Dostarczone</option>
              <option value="anulowane">Anulowane</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-wrap">
          <div *ngIf="isLoading()" class="loading-state">
            <div class="spinner-purple"></div>
            <p>Ładowanie zamówień...</p>
          </div>

          <div *ngIf="error()" class="error-state">
            <p>{{ error() }}</p>
            <button (click)="loadOrders()" class="btn btn-secondary btn-sm">Spróbuj ponownie</button>
          </div>

          <table *ngIf="!isLoading() && !error()">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Klient</th>
                <th>Suma</th>
                <th>Status</th>
                <th>Płatność</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders()">
                <td><span class="order-id">#{{ order.id }}</span></td>
                <td>{{ order.createdAt | date:'short' }}</td>
                <td>
                  <div class="customer-info">
                    <span class="customer-name">{{ order.customerName }}</span>
                    <span class="customer-email">{{ order.customerEmail }}</span>
                  </div>
                </td>
                <td><span class="price-text">{{ order.totalPrice | currency:'PLN' }}</span></td>
                <td>
                  <span class="badge" 
                    [class.badge-nowe]="order.status === 'nowe'"
                    [class.badge-oplacone]="order.status === 'oplacone'"
                    [class.badge-pakowane]="order.status === 'pakowane'"
                    [class.badge-wyslane]="order.status === 'wyslane'"
                    [class.badge-dostarczone]="order.status === 'dostarczone'"
                    [class.badge-anulowane]="order.status === 'anulowane'">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td>
                  <span class="payment-status" [class.paid]="order.paymentStatus === 'Opłacone'">
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/employee/orders', order.id]" class="btn-action view" title="Szczegóły">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </a>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredOrders().length === 0">
                <td colspan="7" class="empty-row">
                  <div class="empty-state">
                    <div class="icon">🔍</div>
                    <p>Nie znaleziono zamówień o podanych kryteriach.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class OrderListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  
  orders = signal<OrderResponse[]>([]);
  statusFilter = signal<string>('');
  isLoading = signal(true);
  error = signal<string | null>(null);

  filteredOrders = computed(() => {
    const filter = this.statusFilter();
    const allOrders = this.orders();
    if (!filter) return allOrders;
    return allOrders.filter(o => o.status === filter);
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.error.set(null);
    this.employeeService.getOrders().subscribe({
      next: (res: any) => {
        const ordersArray = Array.isArray(res) ? res : (res && res.content ? res.content : []);
        this.orders.set(ordersArray);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error.set('Błąd podczas ładowania zamówień.');
        this.isLoading.set(false);
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      nowe: 'Nowe',
      oplacone: 'Opłacone',
      pakowane: 'Pakowane',
      wyslane: 'Wysłane',
      dostarczone: 'Dostarczone',
      anulowane: 'Anulowane'
    };
    return labels[status] || status;
  }
}

