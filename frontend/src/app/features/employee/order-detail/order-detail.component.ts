import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService, OrderResponse } from '../../../core/services/employee.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <div class="header-top">
          <a routerLink="/employee/orders" class="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Powrót do listy
          </a>
          @if (order(); as o) {
            <span class="badge" 
              [class.badge-new]="o.status === 'nowe'"
              [class.badge-paid]="o.status === 'oplacone' || o.status === 'dostarczone'"
              [class.badge-shipped]="o.status === 'wyslane' || o.status === 'pakowane'"
              [class.badge-anulowane]="o.status === 'anulowane'">
              {{ getStatusLabel(o.status) }}
            </span>
          }
        </div>
        
        @if (order(); as o) {
          <h1 class="page-title">Szczegóły zamówienia #{{ o.id }}</h1>
          <p class="page-subtitle">Złożone {{ o.createdAt | date:'medium' }}</p>
        } @else if (isLoading()) {
          <h1 class="page-title">Ładowanie zamówienia...</h1>
        } @else if (error()) {
          <h1 class="page-title">Błąd</h1>
        }
      </header>

      @if (isLoading()) {
        <div class="spinner"></div>
      } @else if (error()) {
        <div class="card error-card">
          <div class="error-content">
            <div class="error-icon">⚠️</div>
            <p>{{ error() }}</p>
            <button class="btn btn-secondary" (click)="ngOnInit()">Spróbuj ponownie</button>
          </div>
        </div>
      } @else if (order(); as o) {
        <div class="order-grid">
          <div class="main-content">
            <!-- Items List -->
            <div class="card items-card">
              <h2 class="section-title">Produkty</h2>
              <div class="items-list">
                <div class="order-item" *ngFor="let item of o.items">
                  <div class="item-main">
                    <div class="item-details">
                      <span class="item-name">{{ item.productName }}</span>
                      <span class="item-sku">ID produktu: #{{ item.productId }} <span *ngIf="item.variantId">| Wariant: #{{ item.variantId }}</span></span>
                    </div>
                  </div>
                  <div class="item-pricing">
                    <div class="item-qty">{{ item.quantity }} x {{ item.price | currency:'PLN' }}</div>
                    <div class="item-subtotal">{{ (item.quantity * item.price) | currency:'PLN' }}</div>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div class="summary-line">
                  <span>Wartość produktów</span>
                  <span>{{ (o.totalPrice - o.shippingFee) | currency:'PLN' }}</span>
                </div>
                <div class="summary-line">
                  <span>Dostawa ({{ o.shippingMethod }})</span>
                  <span>{{ o.shippingFee | currency:'PLN' }}</span>
                </div>
                <div class="summary-line total">
                  <span>Łącznie</span>
                  <span class="total-price">{{ o.totalPrice | currency:'PLN' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <!-- Actions -->
            <div class="card action-card">
              <h3 class="sidebar-title">Zmień status</h3>
              <div class="status-buttons">
                <button class="btn btn-primary purple-glow btn-full" *ngIf="o.status === 'oplacone' || o.status === 'nowe'" (click)="updateStatus('pakowane')">
                  Przygotuj do wysyłki
                </button>
                <button class="btn btn-primary purple-glow btn-full" *ngIf="o.status === 'pakowane'" (click)="updateStatus('wyslane')">
                  Oznacz jako wysłane
                </button>
                <button class="btn btn-success btn-full" *ngIf="o.status === 'wyslane'" (click)="updateStatus('dostarczone')">
                  Oznacz jako dostarczone
                </button>
                <button class="btn btn-danger btn-full" *ngIf="o.status !== 'anulowane' && o.status !== 'dostarczone'" (click)="updateStatus('anulowane')">
                  Anuluj zamówienie
                </button>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="card info-card">
              <h3 class="sidebar-title">Dane Klienta</h3>
              <div class="info-group">
                <label>Klient</label>
                <div class="info-value">{{ o.customerName }}</div>
                <div class="info-sub">{{ o.customerEmail }}</div>
              </div>
              
              <div class="info-group">
                <label>Adres dostawy</label>
                <div class="info-value">
                  {{ o.address.street }}<br>
                  {{ o.address.postalCode }} {{ o.address.city }}<br>
                  {{ o.address.country }}
                </div>
                <div class="info-sub" *ngIf="o.address.phone">Tel: {{ o.address.phone }}</div>
              </div>

              <div class="info-group">
                <label>Metoda płatności</label>
                <div class="info-value">{{ o.paymentMethod }}</div>
                <div class="info-sub" [class.text-success]="o.paymentStatus === 'Opłacone'">
                  {{ o.paymentStatus }}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,

})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  
  order = signal<OrderResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error.set('Nieprawidłowy identyfikator zamówienia.');
      this.isLoading.set(false);
      return;
    }

    this.employeeService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching order:', err);
        this.error.set('Nie udało się pobrać szczegółów zamówienia. Możliwe, że zamówienie nie istnieje.');
        this.isLoading.set(false);
      }
    });
  }

  updateStatus(status: string) {
    const currentOrder = this.order();
    if (!currentOrder) return;
    
    if (status === 'anulowane' && !confirm('Czy na pewno chcesz anulować to zamówienie?')) return;

    this.isLoading.set(true);
    this.employeeService.updateOrderStatus(currentOrder.id, status).subscribe({
      next: (updatedOrder) => {
        this.order.set(updatedOrder);
        this.isLoading.set(false);
      },
      error: (err) => {
        alert('Błąd podczas aktualizacji statusu: ' + (err.error?.message || 'Nieznany błąd'));
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
