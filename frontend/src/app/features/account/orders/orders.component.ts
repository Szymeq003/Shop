import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page container">
      <div class="account-layout">
        <aside class="account-nav">
          <h3 style="margin-bottom: 20px; font-size: 16px; padding: 0 14px;">Cześć {{ profileData().name.split(' ')[0] }}</h3>
          <a routerLink="/account/orders" routerLinkActive="active">Zamówienia</a>
          <a routerLink="/account/returns" routerLinkActive="active">Zwroty</a>
          <a routerLink="/account/wishlist" routerLinkActive="active">Obserwowane</a>
          <a routerLink="/account/reviews" routerLinkActive="active">Opinie</a>
          <a routerLink="/account/addresses" routerLinkActive="active">Dane dostawy</a>
          <a routerLink="/account/profile" routerLinkActive="active">Ustawienia konta</a>
        </aside>

        <main>
          <h2 class="page-title">Moje zamówienia</h2>
          <p class="page-subtitle">Przeglądaj historię i status swoich zamówień.</p>

          @if (isLoading()) {
            <div class="spinner"></div>
          } @else if (orders().length === 0) {
            <div class="empty-state">
              <div class="icon">📦</div>
              <h3>Brak zamówień</h3>
              <p>Nie złożyłeś jeszcze żadnego zamówienia.</p>
              <button class="btn btn-primary" style="margin-top: 20px;" routerLink="/">Zacznij zakupy</button>
            </div>
          } @else {
            <div class="card" style="padding: 0; overflow: hidden;">
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Numer</th>
                      <th>Data</th>
                      <th>Kwota</th>
                      <th>Status zamówienia</th>
                      <th>Status płatności</th>
                      <th>Akcja</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (order of orders(); track order.id) {
                      <tr>
                        <td style="font-weight: 600;">#{{ order.id }}</td>
                        <td>{{ order.createdAt | date:'dd.MM.yyyy HH:mm' }}</td>
                        <td style="font-weight: 600; color: var(--primary-light);">{{ order.totalPrice | currency:'PLN':'symbol':'1.2-2' }}</td>
                        <td>
                          <span class="badge" [ngClass]="'badge-' + order.status.toLowerCase()">
                            {{ order.status }}
                          </span>
                        </td>
                        <td>
                          <span style="font-size: 13px;" [style.color]="order.paymentStatus === 'opłacone' ? 'var(--success)' : 'var(--warning)'">
                            {{ order.paymentStatus }}
                          </span>
                        </td>
                        <td>
                          <a [routerLink]="['/account/orders', order.id]" class="btn btn-secondary btn-sm">
                            Szczegóły
                          </a>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  profileData = signal({
    name: this.authService.currentUser()?.name || '',
    email: this.authService.currentUser()?.email || ''
  });

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
