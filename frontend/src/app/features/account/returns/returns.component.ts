import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService, Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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
          <a routerLink="/account/profile" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Ustawienia konta</a>
        </aside>

        <main>
          <div class="page-header">
            <h2 class="page-title">Moje zwroty</h2>
            <p class="page-subtitle">Anulowane zamówienia i procesy zwrotu środków.</p>
          </div>

          @if (isLoading()) {
            <div class="spinner"></div>
          } @else if (returns().length === 0) {
            <div class="empty-state">
              <div class="icon">🔄</div>
              <h3>Brak zwrotów</h3>
              <p>Nie masz żadnych anulowanych zamówień ani aktywnych procesów zwrotu.</p>
            </div>
          } @else {
            <div class="card" style="padding: 0; overflow: hidden;">
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Numer</th>
                      <th>Data anulowania</th>
                      <th>Kwota</th>
                      <th>Metoda płatności</th>
                      <th>Status płatności</th>
                      <th>Akcja</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (order of returns(); track order.id) {
                      <tr>
                        <td style="font-weight: 600;">#{{ order.id }}</td>
                        <td>{{ order.updatedAt | date:'dd.MM.yyyy HH:mm' }}</td>
                        <td style="font-weight: 600; color: var(--error);">{{ order.totalPrice | currency:'PLN':'symbol':'1.2-2' }}</td>
                        <td style="font-size: 13px;">{{ order.paymentMethod }}</td>
                        <td>
                          <span style="font-size: 13px; color: var(--text-muted);">
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

            <div class="return-info-card">
              <div class="return-info-icon">ℹ️</div>
              <div>
                <strong>Informacja o zwrocie środków</strong>
                <p>Zwrot środków za anulowane zamówienie trafia na konto w ciągu 3–5 dni roboczych, zależnie od wybranej metody płatności.</p>
              </div>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .return-info-card {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-top: 24px;
      padding: 20px 24px;
      background: rgba(255, 107, 107, 0.06);
      border: 1px solid rgba(255, 107, 107, 0.2);
      border-radius: var(--radius);
      font-size: 14px;
    }
    .return-info-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
    .return-info-card strong { display: block; margin-bottom: 4px; color: var(--text); }
    .return-info-card p { color: var(--text-muted); margin: 0; line-height: 1.5; }
  `]
})
export class ReturnsComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  returns = signal<Order[]>([]);
  isLoading = signal(true);

  profileData = signal({
    name: this.authService.currentUser()?.name || ''
  });

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.returns.set(orders.filter(o => o.status === 'anulowane'));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
